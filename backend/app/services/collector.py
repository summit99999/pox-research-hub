import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.services.openalex import fetch_openalex_papers, normalize_doi
from app.services.crossref import fetch_crossref_papers
from app.services.classifier import classify_paper
from app.core.database import get_supabase_admin

logger = logging.getLogger(__name__)

async def run_literature_collection(
    query: Optional[str] = None,
    year_from: int = 2020,
    year_to: int = 2026,
    source: str = "openalex", # 'openalex', 'crossref', 'both'
    max_results: int = 50
) -> Dict[str, Any]:
    """
    Main literature collection pipeline:
    1. Queries scientific databases (OpenAlex, Crossref).
    2. Normalizes identifiers and deduplicates records.
    3. Categorizes publications across the 17 POx/POzi research categories.
    4. Saves to Supabase PostgreSQL database if connected.
    5. Logs telemetry into collection_logs.
    """
    started_at = datetime.utcnow()
    supabase = get_supabase_admin()
    log_id = None
    
    # 1. Log start of collection in database if available
    if supabase:
        try:
            log_res = supabase.table("collection_logs").insert({
                "source": source,
                "query": query or "POx/POzi core corpus",
                "started_at": started_at.isoformat(),
                "status": "running"
            }).execute()
            if log_res.data:
                log_id = log_res.data[0]["id"]
        except Exception as e:
            logger.warning(f"Could not record initial collection log: {e}")
            
    collected_papers: List[Dict[str, Any]] = []
    seen_dois = set()
    
    try:
        # 2. Fetch from OpenAlex
        if source in ["openalex", "both"]:
            try:
                oa_res = await fetch_openalex_papers(
                    query=query,
                    year_from=year_from,
                    year_to=year_to,
                    per_page=max_results
                )
                for paper in oa_res.get("papers", []):
                    doi = paper.get("doi_normalized")
                    if doi and doi not in seen_dois:
                        seen_dois.add(doi)
                        collected_papers.append(paper)
                    elif not doi:
                        # Fallback for papers without DOI: title deduplication
                        collected_papers.append(paper)
            except Exception as e:
                logger.error(f"Error fetching from OpenAlex: {e}")
                
        # 3. Fetch from Crossref
        if source in ["crossref", "both"] and (len(collected_papers) < max_results):
            try:
                cr_papers = await fetch_crossref_papers(
                    query=query,
                    year_from=year_from,
                    year_to=year_to,
                    rows=max_results - len(collected_papers)
                )
                for paper in cr_papers:
                    doi = paper.get("doi_normalized")
                    if doi and doi not in seen_dois:
                        seen_dois.add(doi)
                        collected_papers.append(paper)
                    elif not doi:
                        collected_papers.append(paper)
            except Exception as e:
                logger.error(f"Error fetching from Crossref: {e}")

        records_found = len(collected_papers)
        records_saved = 0

        # 4. Save to Cloud Database (Supabase) if connected
        if supabase and collected_papers:
            # Query existing DOIs to avoid duplicates
            dois_to_check = [p["doi_normalized"] for p in collected_papers if p.get("doi_normalized")]
            existing_dois = set()
            
            if dois_to_check:
                try:
                    existing_res = supabase.table("papers").select("doi_normalized").in_("doi_normalized", dois_to_check).execute()
                    if existing_res.data:
                        existing_dois = {row["doi_normalized"] for row in existing_res.data if row.get("doi_normalized")}
                except Exception as e:
                    logger.warning(f"Failed to query existing DOIs: {e}")

            # Fetch categories map for slug -> id
            category_map: Dict[str, str] = {}
            try:
                cat_res = supabase.table("categories").select("id, slug").execute()
                if cat_res.data:
                    category_map = {row["slug"]: row["id"] for row in cat_res.data}
            except Exception as e:
                logger.warning(f"Failed to fetch categories map: {e}")

            for paper_data in collected_papers:
                norm_doi = paper_data.get("doi_normalized")
                if norm_doi and norm_doi in existing_dois:
                    logger.debug(f"Paper with DOI {norm_doi} already indexed. Skipping.")
                    continue

                # Insert paper
                paper_record = {
                    "doi": paper_data.get("doi"),
                    "doi_normalized": norm_doi,
                    "title": paper_data.get("title"),
                    "abstract": paper_data.get("abstract"),
                    "publication_year": paper_data.get("publication_year"),
                    "publication_date": paper_data.get("publication_date"),
                    "journal": paper_data.get("journal"),
                    "publisher": paper_data.get("publisher"),
                    "landing_page_url": paper_data.get("landing_page_url"),
                    "open_access_url": paper_data.get("open_access_url"),
                    "citation_count": paper_data.get("citation_count", 0),
                    "source": paper_data.get("source", "openalex"),
                    "source_id": paper_data.get("source_id"),
                    "raw_metadata": paper_data.get("raw_metadata", {})
                }
                
                try:
                    paper_insert = supabase.table("papers").insert(paper_record).execute()
                    if not paper_insert.data:
                        continue
                    paper_id = paper_insert.data[0]["id"]
                    records_saved += 1
                    
                    # Insert authors & linkages
                    for author_info in paper_data.get("authors", []):
                        author_name = author_info.get("name")
                        if not author_name:
                            continue
                        author_record = {
                            "name": author_name,
                            "affiliation": author_info.get("affiliation"),
                            "orcid": author_info.get("orcid"),
                            "external_author_id": author_info.get("external_author_id")
                        }
                        
                        # Find or create author
                        author_id = None
                        try:
                            # Try to match by orcid if present, else by name and affiliation
                            if author_info.get("orcid"):
                                a_match = supabase.table("authors").select("id").eq("orcid", author_info["orcid"]).execute()
                                if a_match.data:
                                    author_id = a_match.data[0]["id"]
                            if not author_id:
                                a_res = supabase.table("authors").insert(author_record).execute()
                                if a_res.data:
                                    author_id = a_res.data[0]["id"]
                                    
                            if author_id:
                                supabase.table("paper_authors").insert({
                                    "paper_id": paper_id,
                                    "author_id": author_id,
                                    "author_order": author_info.get("order", 1)
                                }).execute()
                        except Exception as auth_err:
                            logger.debug(f"Author link non-critical error: {auth_err}")

                    # Automatically classify into scientific categories
                    categories_classified = classify_paper(
                        paper_data.get("title", ""),
                        paper_data.get("abstract")
                    )
                    
                    for slug, confidence in categories_classified[:3]: # top 3 matching categories
                        cat_id = category_map.get(slug)
                        if cat_id:
                            try:
                                supabase.table("paper_categories").insert({
                                    "paper_id": paper_id,
                                    "category_id": cat_id,
                                    "classification_confidence": confidence,
                                    "classification_source": "keyword_rule"
                                }).execute()
                            except Exception as cat_err:
                                logger.debug(f"Category link error: {cat_err}")
                                
                except Exception as ins_err:
                    logger.error(f"Failed to insert paper {norm_doi}: {ins_err}")

        # 5. Complete collection log
        completed_at = datetime.utcnow()
        if supabase and log_id:
            try:
                supabase.table("collection_logs").update({
                    "completed_at": completed_at.isoformat(),
                    "status": "success",
                    "records_found": records_found,
                    "records_saved": records_saved
                }).eq("id", log_id).execute()
            except Exception as e:
                logger.warning(f"Could not update completion log: {e}")

        return {
            "status": "success",
            "source": source,
            "records_found": records_found,
            "records_saved": records_saved,
            "sample_papers": collected_papers[:5]
        }
        
    except Exception as e:
        logger.error(f"Collection job failed: {e}")
        if supabase and log_id:
            try:
                supabase.table("collection_logs").update({
                    "completed_at": datetime.utcnow().isoformat(),
                    "status": "failed",
                    "error_message": str(e)
                }).eq("id", log_id).execute()
            except Exception:
                pass
        raise

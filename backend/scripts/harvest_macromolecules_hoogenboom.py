import asyncio
import logging
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from dotenv import load_dotenv
load_dotenv(os.path.join(backend_dir, '.env'))

from app.core.database import get_supabase_admin
from app.services.crossref import fetch_crossref_papers
from app.services.openalex import fetch_openalex_papers
from app.services.classifier import classify_paper
from app.services.analytics import invalidate_analytics_cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("targeted_harvester")

async def harvest_targeted():
    supabase = get_supabase_admin()
    if not supabase:
        print("Supabase admin not available!")
        return

    # Fetch existing category map
    cat_res = supabase.table("categories").select("id, slug").execute()
    category_map = {row["slug"]: row["id"] for row in (cat_res.data or [])}

    print("=== STARTING TARGETED HARVEST FOR MACROMOLECULES & RICHARD HOOGENBOOM ===")

    # 1. Fetch Macromolecules papers from Crossref
    print("\n[1/4] Fetching 'Macromolecules' oxazoline papers from Crossref...")
    cr_macro_papers = await fetch_crossref_papers(
        query="Macromolecules poly(2-oxazoline)",
        year_from=2020,
        year_to=2026,
        rows=50
    )
    print(f"Retrieved {len(cr_macro_papers)} Crossref papers for Macromolecules.")

    # 2. Fetch Macromolecules papers from OpenAlex
    print("\n[2/4] Fetching 'Macromolecules' oxazoline papers from OpenAlex...")
    oa_macro_res = await fetch_openalex_papers(
        query="Macromolecules oxazoline",
        year_from=2020,
        year_to=2026,
        per_page=50
    )
    oa_macro_papers = oa_macro_res.get("papers", [])
    print(f"Retrieved {len(oa_macro_papers)} OpenAlex papers for Macromolecules.")

    # 3. Fetch Richard Hoogenboom papers from Crossref
    print("\n[3/4] Fetching Richard Hoogenboom poly(2-oxazoline) papers from Crossref...")
    cr_hb_papers = await fetch_crossref_papers(
        query="Richard Hoogenboom poly(2-oxazoline)",
        year_from=2020,
        year_to=2026,
        rows=50
    )
    print(f"Retrieved {len(cr_hb_papers)} Crossref papers for Richard Hoogenboom.")

    # 4. Fetch Richard Hoogenboom papers from OpenAlex
    print("\n[4/4] Fetching Richard Hoogenboom poly(2-oxazoline) papers from OpenAlex...")
    oa_hb_res = await fetch_openalex_papers(
        query="Richard Hoogenboom oxazoline",
        year_from=2020,
        year_to=2026,
        per_page=50
    )
    oa_hb_papers = oa_hb_res.get("papers", [])
    print(f"Retrieved {len(oa_hb_papers)} OpenAlex papers for Richard Hoogenboom.")

    all_candidates = cr_macro_papers + oa_macro_papers + cr_hb_papers + oa_hb_papers
    print(f"\nTotal candidate papers collected: {len(all_candidates)}")

    # Deduplicate candidates by normalized DOI
    unique_candidates = []
    seen_dois = set()
    for p in all_candidates:
        doi = p.get("doi_normalized")
        if doi and doi not in seen_dois:
            seen_dois.add(doi)
            unique_candidates.append(p)
        elif not doi and p.get("title"):
            unique_candidates.append(p)

    print(f"Unique candidates after deduplication: {len(unique_candidates)}")

    # Check against database existing DOIs
    dois_to_check = [p["doi_normalized"] for p in unique_candidates if p.get("doi_normalized")]
    existing_dois = set()
    if dois_to_check:
        try:
            for i in range(0, len(dois_to_check), 50):
                batch_dois = dois_to_check[i:i+50]
                existing_res = supabase.table("papers").select("doi_normalized").in_("doi_normalized", batch_dois).execute()
                for row in (existing_res.data or []):
                    if row.get("doi_normalized"):
                        existing_dois.add(row["doi_normalized"])
        except Exception as e:
            print("Error checking existing DOIs:", e)

    print(f"Already indexed in DB: {len(existing_dois)}")
    new_papers = [p for p in unique_candidates if p.get("doi_normalized") not in existing_dois]
    print(f"New papers to insert: {len(new_papers)}")

    saved_count = 0
    author_cache = {}

    # Pre-cache Richard Hoogenboom ID
    hb_res = supabase.table("authors").select("id").ilike("name", "%Hoogenboom%").execute()
    if hb_res.data:
        author_cache["richard hoogenboom"] = hb_res.data[0]["id"]

    for paper_data in new_papers:
        # Normalize Macromolecules journal name if title mentions it
        journal_name = paper_data.get("journal") or ""
        if "macromolecules" in journal_name.lower():
            journal_name = "Macromolecules"

        paper_record = {
            "doi": paper_data.get("doi"),
            "doi_normalized": paper_data.get("doi_normalized"),
            "title": paper_data.get("title"),
            "abstract": paper_data.get("abstract"),
            "publication_year": paper_data.get("publication_year"),
            "publication_date": paper_data.get("publication_date"),
            "journal": journal_name,
            "publisher": paper_data.get("publisher"),
            "landing_page_url": paper_data.get("landing_page_url"),
            "open_access_url": paper_data.get("open_access_url"),
            "citation_count": paper_data.get("citation_count", 0),
            "source": paper_data.get("source", "crossref"),
            "source_id": paper_data.get("source_id"),
            "raw_metadata": paper_data.get("raw_metadata", {})
        }

        try:
            insert_res = supabase.table("papers").insert(paper_record).execute()
            if not insert_res.data:
                continue
            paper_id = insert_res.data[0]["id"]
            saved_count += 1

            # Insert author links
            paper_author_links = []
            for author_info in paper_data.get("authors", []):
                author_name = (author_info.get("name") or "").strip()
                if not author_name:
                    continue

                cache_key = author_name.lower()
                author_id = author_cache.get(cache_key)

                if not author_id:
                    existing_a = supabase.table("authors").select("id").ilike("name", author_name).execute()
                    if existing_a.data:
                        author_id = existing_a.data[0]["id"]
                        author_cache[cache_key] = author_id
                    else:
                        a_res = supabase.table("authors").insert({
                            "name": author_name,
                            "affiliation": author_info.get("affiliation") or ("Ghent University" if "hoogenboom" in author_name.lower() else None),
                            "orcid": author_info.get("orcid")
                        }).execute()
                        if a_res.data:
                            author_id = a_res.data[0]["id"]
                            author_cache[cache_key] = author_id

                if author_id:
                    paper_author_links.append({
                        "paper_id": paper_id,
                        "author_id": author_id,
                        "author_order": author_info.get("order", 1)
                    })

            if paper_author_links:
                try:
                    supabase.table("paper_authors").insert(paper_author_links).execute()
                except Exception as pa_err:
                    pass

            # Classify categories
            cats = classify_paper(paper_data.get("title", ""), paper_data.get("abstract"))
            cat_links = []
            for slug, conf in cats[:3]:
                cid = category_map.get(slug)
                if cid:
                    cat_links.append({
                        "paper_id": paper_id,
                        "category_id": cid,
                        "classification_confidence": conf,
                        "classification_source": "targeted_harvest"
                    })
            if cat_links:
                try:
                    supabase.table("paper_categories").insert(cat_links).execute()
                except Exception:
                    pass

        except Exception as err:
            logger.warning(f"Error inserting paper: {err}")

    print(f"\nSuccessfully inserted {saved_count} new targeted publications into Supabase Cloud!")
    invalidate_analytics_cache()

    # Re-verify counts
    m_check = supabase.table("papers").select("id").ilike("journal", "%Macromolecules%").execute()
    print(f"Total 'Macromolecules' papers in DB now: {len(m_check.data or [])}")

    hb_a = supabase.table("authors").select("id").ilike("name", "%Hoogenboom%").execute()
    if hb_a.data:
        hb_aid = hb_a.data[0]["id"]
        hb_links = supabase.table("paper_authors").select("paper_id").eq("author_id", hb_aid).execute()
        print(f"Total papers linked to Richard Hoogenboom now: {len(hb_links.data or [])}")

if __name__ == "__main__":
    asyncio.run(harvest_targeted())

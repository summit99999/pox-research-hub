import logging
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

OPENALEX_BASE_URL = "https://api.openalex.org/works"

# Core query terms encompassing POx, POzi, oxazoline monomers, CROP, and biomedical applications
DEFAULT_SEARCH_TERMS = [
    "poly(2-oxazoline)",
    "polyoxazoline",
    "poly(2-oxazine)",
    "polyoxazine",
    "2-oxazoline monomer",
    "cationic ring-opening polymerization oxazoline",
    "poly(2-ethyl-2-oxazoline)",
    "poly(2-methyl-2-oxazoline)",
    "poly(2-oxazoline) micelles",
    "poly(2-oxazoline) hydrogel"
]

def reconstruct_abstract(abstract_inverted_index: Optional[Dict[str, List[int]]]) -> Optional[str]:
    """
    Reconstructs the full abstract text from OpenAlex's abstract_inverted_index.
    """
    if not abstract_inverted_index:
        return None
    
    positions: Dict[int, str] = {}
    for word, indices in abstract_inverted_index.items():
        for pos in indices:
            positions[pos] = word
            
    if not positions:
        return None
        
    sorted_words = [positions[i] for i in sorted(positions.keys())]
    return " ".join(sorted_words)

def normalize_doi(raw_doi: Optional[str]) -> Optional[str]:
    """
    Normalizes a DOI to lowercase string without URL prefixes.
    e.g. 'https://doi.org/10.1002/anie.202301234' -> '10.1002/anie.202301234'
    """
    if not raw_doi:
        return None
    doi = raw_doi.strip().lower()
    for prefix in ["https://doi.org/", "http://doi.org/", "doi.org/", "doi:"]:
        if doi.startswith(prefix):
            doi = doi[len(prefix):]
    return doi.strip().rstrip("/")

async def fetch_openalex_papers(
    query: Optional[str] = None,
    year_from: int = 2020,
    year_to: int = 2026,
    per_page: int = 50,
    page: int = 1
) -> Dict[str, Any]:
    """
    Fetches real scientific papers from OpenAlex with polite pool email.
    """
    search_query = query if query and query.strip() else "poly(2-oxazoline) OR polyoxazoline OR poly(2-oxazine)"
    
    headers = {
        "User-Agent": f"POxResearchHub/1.0 (mailto:{settings.OPENALEX_EMAIL})"
    }
    
    params: Dict[str, Any] = {
        "search": search_query,
        "filter": f"publication_year:{year_from}-{year_to},type:article|review",
        "per-page": min(per_page, 100),
        "page": page,
        "sort": "publication_date:desc",
        "mailto": settings.OPENALEX_EMAIL
    }
    
    logger.info(f"Querying OpenAlex: search='{search_query}', years={year_from}-{year_to}, page={page}")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(OPENALEX_BASE_URL, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            results = data.get("results", [])
            total_count = data.get("meta", {}).get("count", 0)
            
            parsed_papers: List[Dict[str, Any]] = []
            for work in results:
                raw_doi = work.get("doi")
                norm_doi = normalize_doi(raw_doi)
                title = work.get("title")
                if not title:
                    continue
                    
                abstract = reconstruct_abstract(work.get("abstract_inverted_index"))
                
                # Venue & Publisher info
                primary_loc = work.get("primary_location") or {}
                source_info = primary_loc.get("source") or {}
                journal = source_info.get("display_name")
                publisher = source_info.get("host_organization_name")
                landing_page = primary_loc.get("landing_page_url") or raw_doi
                
                oa_info = work.get("open_access") or {}
                oa_url = oa_info.get("oa_url") or primary_loc.get("pdf_url")
                
                # Authors
                authors: List[Dict[str, Any]] = []
                for idx, auth_entry in enumerate(work.get("authorships", [])):
                    author_obj = auth_entry.get("author", {})
                    author_name = author_obj.get("display_name")
                    if not author_name:
                        continue
                    
                    institutions = auth_entry.get("institutions", [])
                    affiliation = institutions[0].get("display_name") if institutions else None
                    orcid = author_obj.get("orcid")
                    
                    authors.append({
                        "name": author_name,
                        "affiliation": affiliation,
                        "orcid": orcid,
                        "external_author_id": author_obj.get("id"),
                        "order": idx + 1
                    })
                
                parsed_papers.append({
                    "doi": raw_doi,
                    "doi_normalized": norm_doi,
                    "title": title.strip(),
                    "abstract": abstract,
                    "publication_year": work.get("publication_year"),
                    "publication_date": work.get("publication_date"),
                    "journal": journal,
                    "publisher": publisher,
                    "landing_page_url": landing_page,
                    "open_access_url": oa_url,
                    "citation_count": work.get("cited_by_count", 0),
                    "source": "openalex",
                    "source_id": work.get("id"),
                    "raw_metadata": {
                        "openalex_id": work.get("id"),
                        "concepts": [c.get("display_name") for c in work.get("concepts", [])[:8]],
                        "is_oa": oa_info.get("is_oa", False)
                    },
                    "authors": authors
                })
                
            return {
                "papers": parsed_papers,
                "total_count": total_count,
                "page": page,
                "per_page": per_page
            }
        except httpx.HTTPError as e:
            logger.error(f"OpenAlex request failed: {e}")
            raise

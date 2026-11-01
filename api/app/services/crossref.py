import re
import logging
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

CROSSREF_BASE_URL = "https://api.crossref.org/works"

def clean_crossref_abstract(raw_abstract: Optional[str]) -> Optional[str]:
    """
    Strips JATS XML tags (e.g. <jats:p>, <jats:title>) from Crossref abstracts.
    """
    if not raw_abstract:
        return None
    # Remove XML/JATS tags
    cleaned = re.sub(r'<[^>]+>', '', raw_abstract)
    cleaned = " ".join(cleaned.split())
    return cleaned if cleaned else None

def normalize_doi(raw_doi: Optional[str]) -> Optional[str]:
    if not raw_doi:
        return None
    doi = raw_doi.strip().lower()
    for prefix in ["https://doi.org/", "http://doi.org/", "doi.org/", "doi:"]:
        if doi.startswith(prefix):
            doi = doi[len(prefix):]
    return doi.strip().rstrip("/")

async def fetch_crossref_papers(
    query: Optional[str] = None,
    year_from: int = 2020,
    year_to: int = 2026,
    rows: int = 25
) -> List[Dict[str, Any]]:
    """
    Fetches papers from Crossref API matching oxazoline/oxazine chemistry.
    """
    search_query = query if query and query.strip() else "poly(2-oxazoline) OR poly(2-oxazine)"
    
    headers = {
        "User-Agent": f"POxResearchHub/1.0 (mailto:{settings.CROSSREF_EMAIL})"
    }
    
    params: Dict[str, Any] = {
        "query.bibliographic": search_query,
        "filter": f"from-pub-date:{year_from}-01-01,until-pub-date:{year_to}-12-31,type:journal-article",
        "rows": min(rows, 100),
        "sort": "published",
        "order": "desc"
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(CROSSREF_BASE_URL, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            items = data.get("message", {}).get("items", [])
            parsed_papers: List[Dict[str, Any]] = []
            
            for item in items:
                raw_doi = item.get("DOI")
                norm_doi = normalize_doi(raw_doi)
                title_list = item.get("title", [])
                if not title_list:
                    continue
                title = title_list[0]
                
                abstract = clean_crossref_abstract(item.get("abstract"))
                
                # Publication date
                pub_parts = item.get("published-print", {}).get("date-parts") or item.get("published-online", {}).get("date-parts") or item.get("created", {}).get("date-parts")
                pub_year = None
                pub_date = None
                if pub_parts and len(pub_parts[0]) > 0:
                    pub_year = pub_parts[0][0]
                    if len(pub_parts[0]) >= 3:
                        pub_date = f"{pub_parts[0][0]:04d}-{pub_parts[0][1]:02d}-{pub_parts[0][2]:02d}"
                    elif len(pub_parts[0]) >= 2:
                        pub_date = f"{pub_parts[0][0]:04d}-{pub_parts[0][1]:02d}-01"
                        
                container = item.get("container-title", [])
                journal = container[0] if container else None
                publisher = item.get("publisher")
                url = item.get("URL") or (f"https://doi.org/{raw_doi}" if raw_doi else None)
                citation_count = item.get("is-referenced-by-count", 0)
                
                # Authors
                authors: List[Dict[str, Any]] = []
                for idx, a in enumerate(item.get("author", [])):
                    given = a.get("given", "")
                    family = a.get("family", "")
                    name = f"{given} {family}".strip() or family or given
                    if not name:
                        continue
                    affiliations = a.get("affiliation", [])
                    affil_name = affiliations[0].get("name") if affiliations else None
                    orcid = a.get("ORCID")
                    
                    authors.append({
                        "name": name,
                        "affiliation": affil_name,
                        "orcid": orcid,
                        "order": idx + 1
                    })
                    
                parsed_papers.append({
                    "doi": raw_doi,
                    "doi_normalized": norm_doi,
                    "title": title.strip(),
                    "abstract": abstract,
                    "publication_year": pub_year,
                    "publication_date": pub_date,
                    "journal": journal,
                    "publisher": publisher,
                    "landing_page_url": url,
                    "open_access_url": None,
                    "citation_count": citation_count,
                    "source": "crossref",
                    "source_id": raw_doi,
                    "raw_metadata": {"crossref_type": item.get("type")},
                    "authors": authors
                })
                
            return parsed_papers
        except httpx.HTTPError as e:
            logger.error(f"Crossref request failed: {e}")
            raise

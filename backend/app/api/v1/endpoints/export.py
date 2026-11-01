import csv
import io
import re
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from app.core.database import get_supabase_admin

router = APIRouter()

class ExportRequest(BaseModel):
    paper_ids: Optional[List[str]] = None

def generate_bibtex_key(title: str, year: Optional[int], author: Optional[str]) -> str:
    clean_author = re.sub(r'[^a-zA-Z]', '', (author or "POxHub").split()[0])
    clean_year = str(year or 2026)
    clean_title = re.sub(r'[^a-zA-Z]', '', (title or "Paper").split()[0])
    return f"{clean_author}{clean_year}{clean_title}".lower()

@router.api_route("/csv", methods=["GET", "POST"])
async def export_csv(payload: Optional[ExportRequest] = None):
    """
    Exports publications to a standard CSV file format.
    Supports either POST with specific paper_ids or GET for recent publications.
    """
    supabase = get_supabase_admin()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    query = supabase.table("papers").select("id, title, doi, publication_year, journal, publisher, citation_count, landing_page_url, open_access_url, source")
    if payload and payload.paper_ids:
        query = query.in_("id", payload.paper_ids)
    else:
        query = query.order("publication_year", desc=True).limit(100)

    res = query.execute()
    papers = res.data or []

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "ID", "Title", "DOI", "Year", "Journal", "Publisher", "Citations", "URL", "Open Access URL", "Source"
    ])

    for p in papers:
        writer.writerow([
            p.get("id"),
            p.get("title"),
            p.get("doi"),
            p.get("publication_year"),
            p.get("journal"),
            p.get("publisher"),
            p.get("citation_count"),
            p.get("landing_page_url"),
            p.get("open_access_url"),
            p.get("source")
        ])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="pox_research_hub_export.csv"'}
    )

@router.api_route("/bibtex", methods=["GET", "POST"])
async def export_bibtex(payload: Optional[ExportRequest] = None):
    """
    Exports publications to standard BibTeX format.
    Supports either POST with specific paper_ids or GET for recent publications.
    """
    supabase = get_supabase_admin()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    query = supabase.table("papers").select("id, title, doi, publication_year, journal, publisher, landing_page_url")
    if payload and payload.paper_ids:
        query = query.in_("id", payload.paper_ids)
    else:
        query = query.order("publication_year", desc=True).limit(100)

    res = query.execute()
    papers = res.data or []
    target_ids = [p["id"] for p in papers]

    # Fetch authors
    authors_by_pid = {}
    if target_ids:
        pa_res = supabase.table("paper_authors").select("paper_id, authors(name)").in_("paper_id", target_ids).execute()
        for r in pa_res.data or []:
            pid = r["paper_id"]
            if pid not in authors_by_pid:
                authors_by_pid[pid] = []
            if r.get("authors"):
                authors_by_pid[pid].append(r["authors"]["name"])

    bibtex_entries = []
    for p in papers:
        pid = p["id"]
        authors = authors_by_pid.get(pid, ["POx Research Community"])
        author_str = " and ".join(authors)
        title = p.get("title", "Untitled")
        year = p.get("publication_year", 2026)
        journal = p.get("journal", "")
        doi = p.get("doi", "")
        key = generate_bibtex_key(title, year, authors[0] if authors else "Author")

        entry = f"""@article{{{key},
  author    = {{{author_str}}},
  title     = {{{{{title}}}}},
  journal   = {{{journal}}},
  year      = {{{year}}},
  doi       = {{{doi}}},
  url       = {{{p.get('landing_page_url', '')}}}
}}"""
        bibtex_entries.append(entry)

    full_bibtex = "\n\n".join(bibtex_entries)
    return Response(
        content=full_bibtex,
        media_type="application/x-bibtex",
        headers={"Content-Disposition": 'attachment; filename="pox_research_hub_export.bib"'}
    )

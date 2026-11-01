import logging
import math
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException, Depends
from app.core.database import get_supabase_admin
from app.core.security import get_current_user
from app.models.schemas import PaperListResponse, PaperResponse, AuthorResponse, CategoryResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=PaperListResponse)
async def list_papers(
    query: Optional[str] = Query(None, description="Free-text search across title, abstract, and journal"),
    year_from: Optional[int] = Query(2020, description="Minimum publication year"),
    year_to: Optional[int] = Query(2026, description="Maximum publication year"),
    category_slug: Optional[str] = Query(None, description="Filter by category slug"),
    journal: Optional[str] = Query(None, description="Filter by journal name"),
    sort_by: str = Query("publication_year", pattern="^(publication_year|citation_count|publication_date|collected_at)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    supabase = get_supabase_admin()
    if not supabase:
        return PaperListResponse(items=[], total=0, page=page, page_size=page_size, total_pages=0)

    try:
        # Build base query
        db_query = supabase.table("papers").select(
            "id, doi, doi_normalized, title, abstract, publication_year, publication_date, journal, publisher, landing_page_url, open_access_url, citation_count, source, source_id, raw_metadata, collected_at, updated_at",
            count="exact"
        )

        if year_from:
            db_query = db_query.gte("publication_year", year_from)
        if year_to:
            db_query = db_query.lte("publication_year", year_to)
        if journal:
            db_query = db_query.ilike("journal", f"%{journal}%")

        # Full-text or title/abstract search
        if query and query.strip():
            term = query.strip()
            # If search contains spaces or boolean keywords, use textSearch or ilike
            db_query = db_query.or_(f"title.ilike.%{term}%,abstract.ilike.%{term}%,journal.ilike.%{term}%")

        # Category filtering through junction
        if category_slug:
            cat_res = supabase.table("categories").select("id").eq("slug", category_slug).execute()
            if cat_res.data:
                cat_id = cat_res.data[0]["id"]
                pc_res = supabase.table("paper_categories").select("paper_id").eq("category_id", cat_id).execute()
                paper_ids = [r["paper_id"] for r in (pc_res.data or [])]
                if paper_ids:
                    db_query = db_query.in_("id", paper_ids)
                else:
                    return PaperListResponse(items=[], total=0, page=page, page_size=page_size, total_pages=0)

        # Sorting
        descending = (sort_order == "desc")
        db_query = db_query.order(sort_by, desc=descending)

        # Pagination
        offset = (page - 1) * page_size
        db_query = db_query.range(offset, offset + page_size - 1)

        result = db_query.execute()
        total_count = result.count or 0
        papers_data = result.data or []

        # Enrich with authors, categories, and summary status
        enriched_items: List[PaperResponse] = []
        if papers_data:
            paper_ids = [p["id"] for p in papers_data]
            
            # Fetch authors
            pa_res = supabase.table("paper_authors").select("paper_id, author_order, authors(id, name, affiliation, orcid)").in_("paper_id", paper_ids).execute()
            authors_by_paper = {}
            for row in pa_res.data or []:
                pid = row["paper_id"]
                a_info = row.get("authors")
                if a_info:
                    if pid not in authors_by_paper:
                        authors_by_paper[pid] = []
                    authors_by_paper[pid].append(AuthorResponse(
                        id=a_info["id"],
                        name=a_info["name"],
                        affiliation=a_info.get("affiliation"),
                        orcid=a_info.get("orcid")
                    ))

            # Fetch categories
            pcat_res = supabase.table("paper_categories").select("paper_id, categories(id, category_name, slug, description, display_order)").in_("paper_id", paper_ids).execute()
            categories_by_paper = {}
            for row in pcat_res.data or []:
                pid = row["paper_id"]
                c_info = row.get("categories")
                if c_info:
                    if pid not in categories_by_paper:
                        categories_by_paper[pid] = []
                    categories_by_paper[pid].append(CategoryResponse(
                        id=c_info["id"],
                        category_name=c_info["category_name"],
                        slug=c_info["slug"],
                        description=c_info.get("description"),
                        display_order=c_info.get("display_order", 0)
                    ))

            # Fetch summary existence
            sum_res = supabase.table("paper_summaries").select("paper_id").in_("paper_id", paper_ids).execute()
            summarized_ids = {r["paper_id"] for r in (sum_res.data or [])}

            # Fetch user library status if user logged in
            user_lib_map = {}
            user_scr_map = {}
            if current_user and current_user.get("id"):
                uid = current_user["id"]
                ul_res = supabase.table("user_library").select("paper_id, favourite, reading_status").eq("user_id", uid).in_("paper_id", paper_ids).execute()
                for r in ul_res.data or []:
                    user_lib_map[r["paper_id"]] = r

                sc_res = supabase.table("screening_records").select("paper_id, screening_status").eq("user_id", uid).in_("paper_id", paper_ids).execute()
                for r in sc_res.data or []:
                    user_scr_map[r["paper_id"]] = r["screening_status"]

            for p in papers_data:
                pid = p["id"]
                lib_entry = user_lib_map.get(pid, {})
                enriched_items.append(PaperResponse(
                    id=p["id"],
                    doi=p.get("doi"),
                    doi_normalized=p.get("doi_normalized"),
                    title=p["title"],
                    abstract=p.get("abstract"),
                    publication_year=p.get("publication_year"),
                    publication_date=p.get("publication_date"),
                    journal=p.get("journal"),
                    publisher=p.get("publisher"),
                    landing_page_url=p.get("landing_page_url"),
                    open_access_url=p.get("open_access_url"),
                    citation_count=p.get("citation_count", 0),
                    source=p.get("source", "openalex"),
                    source_id=p.get("source_id"),
                    collected_at=p["collected_at"],
                    updated_at=p["updated_at"],
                    authors=authors_by_paper.get(pid, []),
                    categories=categories_by_paper.get(pid, []),
                    is_saved=(pid in user_lib_map),
                    is_favourite=lib_entry.get("favourite", False),
                    reading_status=lib_entry.get("reading_status"),
                    screening_status=user_scr_map.get(pid),
                    has_summary=(pid in summarized_ids)
                ))

        total_pages = math.ceil(total_count / page_size) if total_count > 0 else 0
        return PaperListResponse(
            items=enriched_items,
            total=total_count,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )

    except Exception as e:
        logger.error(f"Error listing papers: {e}")
        return PaperListResponse(items=[], total=0, page=page, page_size=page_size, total_pages=0)

@router.get("/{paper_id}", response_model=PaperResponse)
async def get_paper(
    paper_id: str,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    supabase = get_supabase_admin()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    res = supabase.table("papers").select("*").eq("id", paper_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Publication not found")
        
    p = res.data[0]
    
    # Authors
    pa_res = supabase.table("paper_authors").select("author_order, authors(id, name, affiliation, orcid)").eq("paper_id", paper_id).execute()
    authors = []
    for r in pa_res.data or []:
        a = r.get("authors")
        if a:
            authors.append(AuthorResponse(id=a["id"], name=a["name"], affiliation=a.get("affiliation"), orcid=a.get("orcid")))
            
    # Categories
    pc_res = supabase.table("paper_categories").select("categories(id, category_name, slug, description, display_order)").eq("paper_id", paper_id).execute()
    categories = []
    for r in pc_res.data or []:
        c = r.get("categories")
        if c:
            categories.append(CategoryResponse(id=c["id"], category_name=c["category_name"], slug=c["slug"], description=c.get("description"), display_order=c.get("display_order", 0)))
            
    # Summary
    sum_res = supabase.table("paper_summaries").select("id").eq("paper_id", paper_id).execute()
    has_summary = bool(sum_res.data)

    # Library status
    is_saved = False
    is_fav = False
    reading_status = None
    screening_status = None
    
    if current_user and current_user.get("id"):
        uid = current_user["id"]
        lib_res = supabase.table("user_library").select("favourite, reading_status").eq("user_id", uid).eq("paper_id", paper_id).execute()
        if lib_res.data:
            is_saved = True
            is_fav = lib_res.data[0].get("favourite", False)
            reading_status = lib_res.data[0].get("reading_status")
            
        scr_res = supabase.table("screening_records").select("screening_status").eq("user_id", uid).eq("paper_id", paper_id).execute()
        if scr_res.data:
            screening_status = scr_res.data[0].get("screening_status")

    return PaperResponse(
        id=p["id"],
        doi=p.get("doi"),
        doi_normalized=p.get("doi_normalized"),
        title=p["title"],
        abstract=p.get("abstract"),
        publication_year=p.get("publication_year"),
        publication_date=p.get("publication_date"),
        journal=p.get("journal"),
        publisher=p.get("publisher"),
        landing_page_url=p.get("landing_page_url"),
        open_access_url=p.get("open_access_url"),
        citation_count=p.get("citation_count", 0),
        source=p.get("source", "openalex"),
        source_id=p.get("source_id"),
        collected_at=p["collected_at"],
        updated_at=p["updated_at"],
        authors=authors,
        categories=categories,
        is_saved=is_saved,
        is_favourite=is_fav,
        reading_status=reading_status,
        screening_status=screening_status,
        has_summary=has_summary
    )

@router.get("/{paper_id}/related", response_model=List[PaperResponse])
async def get_related_papers(
    paper_id: str,
    limit: int = 5,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Finds related publications sharing categories or polymer keywords.
    """
    supabase = get_supabase_admin()
    if not supabase:
        return []
        
    # Get categories of current paper
    cats = supabase.table("paper_categories").select("category_id").eq("paper_id", paper_id).execute()
    cat_ids = [r["category_id"] for r in (cats.data or [])]
    
    if not cat_ids:
        # Fallback to recent papers
        rel = supabase.table("papers").select("id, title, publication_year, journal, doi, citation_count, collected_at, updated_at").neq("id", paper_id).limit(limit).execute()
        return [PaperResponse(**p, authors=[], categories=[]) for p in (rel.data or [])]
        
    # Find papers sharing same category
    shared = supabase.table("paper_categories").select("paper_id").in_("category_id", cat_ids).neq("paper_id", paper_id).limit(limit * 2).execute()
    shared_ids = list({r["paper_id"] for r in (shared.data or [])})[:limit]
    
    if not shared_ids:
        return []
        
    papers_res = supabase.table("papers").select("id, title, publication_year, journal, doi, citation_count, collected_at, updated_at").in_("id", shared_ids).execute()
    return [PaperResponse(**p, authors=[], categories=[]) for p in (papers_res.data or [])]

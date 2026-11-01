import logging
from typing import Dict, Any, List
from collections import defaultdict
from app.core.database import get_supabase_admin

logger = logging.getLogger(__name__)

async def compute_analytics_overview() -> Dict[str, Any]:
    """
    Computes publication metrics, annual trends, POx vs POzi growth, category breakdown,
    and author/journal statistics.
    """
    supabase = get_supabase_admin()
    
    # Defaults in case DB is still empty or initializing
    default_overview = {
        "total_papers": 0,
        "papers_current_year": 0,
        "pox_papers_count": 0,
        "pozi_papers_count": 0,
        "annual_trends": [],
        "category_breakdown": [],
        "top_authors": [],
        "top_journals": [],
        "stimuli_responsive_growth": {
            "thermoresponsive": 0,
            "ros_responsive": 0,
            "photoresponsive": 0,
            "ph_responsive": 0
        }
    }
    
    if not supabase:
        return default_overview

    try:
        # 1. Total papers count
        papers_res = supabase.table("papers").select("id, title, publication_year, journal, citation_count").execute()
        papers = papers_res.data or []
        
        total_papers = len(papers)
        current_year = 2026
        papers_current_year = sum(1 for p in papers if p.get("publication_year") == current_year)
        
        # 2. Count POx vs POzi in title
        pox_count = 0
        pozi_count = 0
        year_counts = defaultdict(lambda: {"pox": 0, "pozi": 0, "total": 0})
        journal_counts = defaultdict(int)
        
        for p in papers:
            title = (p.get("title") or "").lower()
            year = p.get("publication_year") or 2020
            
            is_pox = "oxazoline" in title or "pox" in title
            is_pozi = "oxazine" in title or "pozi" in title
            
            if is_pox:
                pox_count += 1
                year_counts[year]["pox"] += 1
            if is_pozi:
                pozi_count += 1
                year_counts[year]["pozi"] += 1
                
            year_counts[year]["total"] += 1
            
            j = p.get("journal")
            if j:
                journal_counts[j] += 1

        annual_trends = [
            {
                "year": y,
                "pox_count": year_counts[y]["pox"],
                "pozi_count": year_counts[y]["pozi"],
                "total_count": year_counts[y]["total"]
            }
            for y in sorted(year_counts.keys())
        ]
        
        top_journals = [
            {"journal": j, "paper_count": count}
            for j, count in sorted(journal_counts.items(), key=lambda x: x[1], reverse=True)[:8]
        ]
        
        # 3. Category breakdown
        cat_res = supabase.table("categories").select("id, category_name, slug").execute()
        categories = cat_res.data or []
        cat_map = {c["id"]: c for c in categories}
        
        cat_counts_res = supabase.table("paper_categories").select("category_id").execute()
        pc_rows = cat_counts_res.data or []
        category_counts_dict = defaultdict(int)
        for row in pc_rows:
            cid = row.get("category_id")
            if cid in cat_map:
                category_counts_dict[cid] += 1
                
        category_breakdown = [
            {
                "category_name": cat_map[cid]["category_name"],
                "slug": cat_map[cid]["slug"],
                "count": count
            }
            for cid, count in sorted(category_counts_dict.items(), key=lambda x: x[1], reverse=True)
        ]
        
        # 4. Top authors
        authors_res = supabase.table("paper_authors").select("author_id, authors(name, affiliation)").execute()
        author_tally = defaultdict(lambda: {"count": 0, "name": "", "affiliation": ""})
        for row in authors_res.data or []:
            a_obj = row.get("authors") or {}
            a_name = a_obj.get("name")
            if a_name:
                author_tally[a_name]["count"] += 1
                author_tally[a_name]["name"] = a_name
                author_tally[a_name]["affiliation"] = a_obj.get("affiliation")
                
        top_authors = [
            {"name": val["name"], "paper_count": val["count"], "affiliation": val["affiliation"]}
            for val in sorted(author_tally.values(), key=lambda x: x["count"], reverse=True)[:8]
        ]
        
        # 5. Stimuli responsive metrics
        stimuli = {
            "thermoresponsive": sum(1 for p in papers if "thermo" in (p.get("title") or "").lower() or "lcst" in (p.get("title") or "").lower()),
            "ros_responsive": sum(1 for p in papers if "ros" in (p.get("title") or "").lower() or "thioether" in (p.get("title") or "").lower() or "oxidation" in (p.get("title") or "").lower()),
            "photoresponsive": sum(1 for p in papers if "photo" in (p.get("title") or "").lower() or "light" in (p.get("title") or "").lower()),
            "ph_responsive": sum(1 for p in papers if "ph" in (p.get("title") or "").lower() or "acid" in (p.get("title") or "").lower())
        }

        return {
            "total_papers": total_papers,
            "papers_current_year": papers_current_year,
            "pox_papers_count": pox_count,
            "pozi_papers_count": pozi_count,
            "annual_trends": annual_trends,
            "category_breakdown": category_breakdown,
            "top_authors": top_authors,
            "top_journals": top_journals,
            "stimuli_responsive_growth": stimuli
        }
    except Exception as e:
        logger.error(f"Error computing analytics: {e}")
        return default_overview

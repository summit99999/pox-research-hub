import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends
from app.core.database import get_supabase_admin
from app.core.security import get_current_user
from app.services.ai_gap_analyzer import analyze_research_gaps
from app.models.schemas import GenerateGapReportRequest, ResearchGapReportResponse, ProposedResearchGap

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=List[ResearchGapReportResponse])
async def list_gap_reports(
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Returns previously generated research gap reports.
    """
    supabase = get_supabase_admin()
    if not supabase:
        return []

    try:
        query = supabase.table("research_gap_reports").select("*").order("generated_at", desc=True).limit(20)
        res = query.execute()
        
        reports: List[ResearchGapReportResponse] = []
        for r in res.data or []:
            rep_json = r.get("report_json", {})
            raw_gaps = rep_json.get("gaps", [])
            parsed_gaps = [ProposedResearchGap.model_validate(g) for g in raw_gaps]
            
            reports.append(ResearchGapReportResponse(
                id=r["id"],
                title=r["title"],
                query_context=r.get("query_context"),
                gaps=parsed_gaps,
                generated_at=r["generated_at"]
            ))
        return reports
    except Exception as e:
        logger.error(f"Error fetching research gap reports: {e}")
        return []

@router.post("/generate", response_model=ResearchGapReportResponse)
async def generate_gap_report(
    payload: GenerateGapReportRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Performs AI-assisted research-gap discovery grounded in indexed POx/POzi publications.
    """
    user_id = current_user.get("id") if current_user else None
    
    try:
        report_data = await analyze_research_gaps(
            focus_area=payload.focus_area or "Poly(2-oxazoline) and Poly(2-oxazine) chemistry",
            user_id=user_id
        )
        
        parsed_gaps = [ProposedResearchGap.model_validate(g) for g in report_data.get("gaps", [])]
        
        return ResearchGapReportResponse(
            id=report_data.get("id", "temp-gap-id"),
            title=report_data["title"],
            query_context=report_data.get("query_context"),
            gaps=parsed_gaps,
            generated_at=report_data.get("generated_at", "2026-11-01T00:00:00Z")
        )
    except Exception as e:
        logger.error(f"Error generating research gap report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

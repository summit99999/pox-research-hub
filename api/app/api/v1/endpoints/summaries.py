import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from app.core.database import get_supabase_admin
from app.core.security import get_current_user
from app.services.ai_summarizer import generate_scientific_summary
from app.models.schemas import SummaryResponse, ScientificSummary13Sections

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/{paper_id}", response_model=SummaryResponse)
async def get_summary(
    paper_id: str,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Retrieves the existing AI-generated 13-section scientific summary for a paper.
    """
    supabase = get_supabase_admin()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    res = supabase.table("paper_summaries").select("*").eq("paper_id", paper_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="No AI summary generated for this publication yet")

    record = res.data[0]
    return SummaryResponse(
        id=record["id"],
        paper_id=record["paper_id"],
        model_name=record["model_name"],
        summary=ScientificSummary13Sections.model_validate(record["summary_json"]),
        source_content_type=record.get("source_content_type", "abstract_and_metadata"),
        generated_at=record["generated_at"]
    )

@router.post("/{paper_id}/generate", response_model=SummaryResponse)
async def generate_paper_summary(
    paper_id: str,
    model_name: Optional[str] = None,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Generates a structured 13-section scientific summary using Google Gemini AI.
    """
    supabase = get_supabase_admin()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    # Fetch paper details
    p_res = supabase.table("papers").select("*").eq("id", paper_id).execute()
    if not p_res.data:
        raise HTTPException(status_code=404, detail="Publication not found")
        
    paper = p_res.data[0]
    
    # Fetch authors
    pa_res = supabase.table("paper_authors").select("authors(name)").eq("paper_id", paper_id).execute()
    authors = [{"name": r["authors"]["name"]} for r in (pa_res.data or []) if r.get("authors")]
    paper["authors"] = authors

    try:
        summary_result = await generate_scientific_summary(paper, model_name=model_name)
        
        # Query saved summary record
        sum_record = supabase.table("paper_summaries").select("*").eq("paper_id", paper_id).execute()
        if sum_record.data:
            rec = sum_record.data[0]
            return SummaryResponse(
                id=rec["id"],
                paper_id=rec["paper_id"],
                model_name=rec["model_name"],
                summary=ScientificSummary13Sections.model_validate(rec["summary_json"]),
                source_content_type=rec.get("source_content_type", "abstract_and_metadata"),
                generated_at=rec["generated_at"]
            )
        else:
            return SummaryResponse(
                id="temporary-summary-id",
                paper_id=paper_id,
                model_name=summary_result["model_name"],
                summary=ScientificSummary13Sections.model_validate(summary_result["summary"]),
                source_content_type=summary_result.get("source_content_type", "abstract_and_metadata"),
                generated_at=summary_result.get("generated_at", "2026-11-01T00:00:00Z")
            )
    except Exception as e:
        logger.error(f"Error generating summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

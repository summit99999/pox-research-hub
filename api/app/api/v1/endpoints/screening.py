import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from app.core.database import get_supabase_admin
from app.core.security import get_current_user
from app.models.schemas import ScreeningRecordUpdate

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
async def list_screening_records(
    status_filter: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Returns systematic literature review screening decisions.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    supabase = get_supabase_admin()
    if not supabase:
        return []

    try:
        q = supabase.table("screening_records").select("paper_id, screening_status, screening_notes, updated_at, papers(*)").eq("user_id", user_id)
        if status_filter:
            q = q.eq("screening_status", status_filter)
            
        res = q.order("updated_at", desc=True).execute()
        return res.data or []
    except Exception as e:
        logger.error(f"Error fetching screening records: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{paper_id}")
async def set_screening_decision(
    paper_id: str,
    payload: ScreeningRecordUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Save or update screening decision for systematic review: 'included', 'excluded', or 'maybe'.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    if payload.screening_status not in ["included", "excluded", "maybe"]:
        raise HTTPException(status_code=400, detail="Invalid screening status. Must be included, excluded, or maybe.")

    supabase = get_supabase_admin()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    try:
        record = {
            "user_id": user_id,
            "paper_id": paper_id,
            "screening_status": payload.screening_status,
            "screening_notes": payload.screening_notes,
            "updated_at": datetime.utcnow().isoformat()
        }
        res = supabase.table("screening_records").upsert(record, on_conflict="user_id,paper_id").execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        logger.error(f"Failed to record screening decision: {e}")
        raise HTTPException(status_code=500, detail=str(e))

import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from app.core.database import get_supabase_admin
from app.core.security import get_current_user
from app.models.schemas import UserLibraryUpdate, PaperResponse, AuthorResponse, CategoryResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
async def get_user_library(
    reading_status: Optional[str] = None,
    favourite_only: bool = False,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Returns user's saved library papers with notes, tags, and reading status.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    supabase = get_supabase_admin()
    if not supabase:
        return []

    try:
        query = supabase.table("user_library").select("paper_id, favourite, reading_status, personal_notes, tags, updated_at, papers(*)").eq("user_id", user_id)
        if reading_status:
            query = query.eq("reading_status", reading_status)
        if favourite_only:
            query = query.eq("favourite", True)
            
        res = query.order("updated_at", desc=True).execute()
        library_items = []
        for r in res.data or []:
            paper = r.get("papers")
            if not paper:
                continue
            library_items.append({
                "paper_id": r["paper_id"],
                "favourite": r.get("favourite", False),
                "reading_status": r.get("reading_status", "unread"),
                "personal_notes": r.get("personal_notes"),
                "tags": r.get("tags", []),
                "updated_at": r["updated_at"],
                "paper": paper
            })
        return library_items
    except Exception as e:
        logger.error(f"Error fetching user library: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{paper_id}")
async def update_library_entry(
    paper_id: str,
    payload: UserLibraryUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Add or update paper in user library (favourite, reading status, personal notes).
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    supabase = get_supabase_admin()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    update_fields: Dict[str, Any] = {
        "user_id": user_id,
        "paper_id": paper_id,
        "updated_at": datetime.utcnow().isoformat()
    }
    if payload.favourite is not None:
        update_fields["favourite"] = payload.favourite
    if payload.reading_status is not None:
        update_fields["reading_status"] = payload.reading_status
    if payload.personal_notes is not None:
        update_fields["personal_notes"] = payload.personal_notes
    if payload.tags is not None:
        update_fields["tags"] = payload.tags

    try:
        res = supabase.table("user_library").upsert(update_fields, on_conflict="user_id,paper_id").execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        logger.error(f"Failed to update library entry: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{paper_id}")
async def remove_from_library(
    paper_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Removes a paper from user's personal library.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    supabase = get_supabase_admin()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    try:
        supabase.table("user_library").delete().eq("user_id", user_id).eq("paper_id", paper_id).execute()
        return {"status": "success", "message": "Paper removed from library"}
    except Exception as e:
        logger.error(f"Failed to remove from library: {e}")
        raise HTTPException(status_code=500, detail=str(e))

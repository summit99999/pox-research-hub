import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.database import get_supabase_admin
from app.core.security import get_current_user
from app.models.schemas import CategoryResponse

logger = logging.getLogger(__name__)
router = APIRouter()

class CategoryAssignRequest(BaseModel):
    category_slugs: List[str]

@router.get("", response_model=List[CategoryResponse])
async def list_categories():
    """
    Returns all registered scientific research categories in the POx/POzi hub.
    """
    supabase = get_supabase_admin()
    if not supabase:
        return []
        
    try:
        res = supabase.table("categories").select("*").order("display_order", desc=False).execute()
        return [
            CategoryResponse(
                id=r["id"],
                category_name=r["category_name"],
                slug=r["slug"],
                description=r.get("description"),
                display_order=r.get("display_order", 0)
            )
            for r in (res.data or [])
        ]
    except Exception as e:
        logger.error(f"Failed to fetch categories: {e}")
        return []

@router.post("/{paper_id}/assign")
async def assign_categories(
    paper_id: str,
    payload: CategoryAssignRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Manually assign or correct research categories for a publication.
    """
    supabase = get_supabase_admin()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")

    try:
        # Resolve category slugs to IDs
        cat_res = supabase.table("categories").select("id, slug").in_("slug", payload.category_slugs).execute()
        category_ids = [c["id"] for c in (cat_res.data or [])]
        
        # Remove old manual categories or sync
        supabase.table("paper_categories").delete().eq("paper_id", paper_id).execute()
        
        for cid in category_ids:
            supabase.table("paper_categories").insert({
                "paper_id": paper_id,
                "category_id": cid,
                "classification_confidence": 1.0,
                "classification_source": "manual"
            }).execute()
            
        return {"status": "success", "assigned_count": len(category_ids)}
    except Exception as e:
        logger.error(f"Failed to assign categories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Header, HTTPException, Depends, BackgroundTasks
from app.core.config import settings
from app.core.security import get_current_user
from app.core.database import get_supabase_admin
from app.services.collector import run_literature_collection
from app.models.schemas import CollectionTriggerRequest, CollectionLogResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/trigger")
async def trigger_collection(
    payload: CollectionTriggerRequest,
    background_tasks: BackgroundTasks,
    x_cron_secret: Optional[str] = Header(None),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Triggers automated or manual literature collection.
    Accessible via:
    1. Authenticated user session from the frontend dashboard.
    2. Cloud cron scheduler (e.g. Render Cron, GitHub Actions) with X-Cron-Secret header matching CRON_SECRET.
    """
    is_cron_authorized = (x_cron_secret and x_cron_secret == settings.CRON_SECRET)
    is_user_authorized = bool(current_user) or (settings.ENVIRONMENT == "development")

    if not is_cron_authorized and not is_user_authorized:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized. Provide valid user session or X-Cron-Secret header."
        )

    # For fast UI response on large batches, run in background if max_results > 10
    if payload.max_results > 10:
        background_tasks.add_task(
            run_literature_collection,
            query=payload.query,
            year_from=payload.year_from,
            year_to=payload.year_to,
            source=payload.source,
            max_results=payload.max_results
        )
        return {
            "status": "started_in_background",
            "message": f"Literature collection started in background for {payload.source}. Check logs for progress.",
            "parameters": payload.model_dump()
        }
    else:
        # Run synchronously for small batches so frontend gets immediate results
        result = await run_literature_collection(
            query=payload.query,
            year_from=payload.year_from,
            year_to=payload.year_to,
            source=payload.source,
            max_results=payload.max_results
        )
        return result

@router.get("/logs", response_model=List[CollectionLogResponse])
async def list_collection_logs(
    limit: int = 20,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user)
):
    """
    Returns recent literature collection logs.
    """
    supabase = get_supabase_admin()
    if not supabase:
        return []
        
    try:
        res = supabase.table("collection_logs").select("*").order("started_at", desc=True).limit(limit).execute()
        return [
            CollectionLogResponse(
                id=r["id"],
                source=r["source"],
                query=r.get("query"),
                started_at=r["started_at"],
                completed_at=r.get("completed_at"),
                status=r.get("status", "running"),
                records_found=r.get("records_found", 0),
                records_saved=r.get("records_saved", 0),
                error_message=r.get("error_message")
            )
            for r in (res.data or [])
        ]
    except Exception as e:
        logger.error(f"Failed to fetch collection logs: {e}")
        return []

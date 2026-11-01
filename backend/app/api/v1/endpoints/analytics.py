import logging
from fastapi import APIRouter
from app.services.analytics import compute_analytics_overview
from app.models.schemas import AnalyticsOverviewResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/overview", response_model=AnalyticsOverviewResponse)
async def get_analytics_overview():
    """
    Returns research trend analytics: publication growth, POx vs POzi breakdown,
    category distributions, top journals, authors, and stimuli-responsive trends.
    """
    data = await compute_analytics_overview()
    return AnalyticsOverviewResponse(**data)

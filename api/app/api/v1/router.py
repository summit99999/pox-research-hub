from fastapi import APIRouter
from app.api.v1.endpoints import (
    papers,
    categories,
    summaries,
    collector,
    library,
    screening,
    gaps,
    analytics,
    review,
    export
)

api_router = APIRouter()

api_router.include_router(papers.router, prefix="/papers", tags=["Publications"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(summaries.router, prefix="/summaries", tags=["AI Summaries"])
api_router.include_router(collector.router, prefix="/collector", tags=["Literature Collector"])
api_router.include_router(library.router, prefix="/library", tags=["Personal Library"])
api_router.include_router(screening.router, prefix="/screening", tags=["Systematic Review Screening"])
api_router.include_router(gaps.router, prefix="/gaps", tags=["Research Gap Engine"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Research Analytics"])
api_router.include_router(review.router, prefix="/review", tags=["Literature Review Workspace"])
api_router.include_router(export.router, prefix="/export", tags=["Export Data"])

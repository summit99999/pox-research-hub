import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.core.database import get_supabase_admin

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("pox_research_hub")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing POx Research Hub Backend...")
    supabase = get_supabase_admin()
    if supabase:
        logger.info("Supabase Cloud Database initialized successfully.")
    else:
        logger.warning("Supabase Cloud Database credentials pending configuration.")
    yield
    logger.info("Shutting down POx Research Hub Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Scientific Literature Discovery, AI Analysis & Research Hub for Poly(2-oxazoline) and Poly(2-oxazine) Chemistry.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Root"])
def root_info():
    return {
        "platform": "POx Research Hub API",
        "description": "Scientific literature platform for poly(2-oxazoline), poly(2-oxazine), and oxazoline chemistry.",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

@app.get("/api/health", tags=["Health"])
async def health_check():
    supabase = get_supabase_admin()
    db_status = "connected" if supabase is not None else "unconfigured"
    ai_status = "configured" if bool(settings.GEMINI_API_KEY) else "unconfigured"
    
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "ai_engine": ai_status,
        "active_ai_model": settings.GEMINI_MODEL
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)

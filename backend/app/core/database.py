import logging
from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_admin_client: Optional[Client] = None
_supabase_anon_client: Optional[Client] = None

def get_supabase_admin() -> Optional[Client]:
    """
    Returns an administrative Supabase client using the SERVICE_ROLE_KEY.
    Used for server-side background tasks, paper ingestion, and admin tasks.
    """
    global _supabase_admin_client
    if _supabase_admin_client is not None:
        return _supabase_admin_client
    
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.warning("Supabase URL or SERVICE_ROLE_KEY is not configured.")
        return None
    
    try:
        _supabase_admin_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
        return _supabase_admin_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase admin client: {e}")
        return None

def get_supabase_anon() -> Optional[Client]:
    """
    Returns an anon client for public / authenticated operations.
    """
    global _supabase_anon_client
    if _supabase_anon_client is not None:
        return _supabase_anon_client
        
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        logger.warning("Supabase URL or ANON_KEY is not configured.")
        return None
        
    try:
        _supabase_anon_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY
        )
        return _supabase_anon_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase anon client: {e}")
        return None

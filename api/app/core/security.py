import logging
from typing import Optional, Dict, Any
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.database import get_supabase_anon
from app.core.config import settings

logger = logging.getLogger(__name__)
security_scheme = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> Optional[Dict[str, Any]]:
    """
    Validates Supabase JWT access token and returns user profile.
    If auth is not configured during initial setup, returns a dev mock user in development mode.
    """
    if not credentials:
        if settings.ENVIRONMENT == "development":
            # Permissive local dev fallback if no token provided during early testing
            return {"id": "00000000-0000-0000-0000-000000000000", "email": "dev@oxazoline-hub.org", "role": "authenticated"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required"
        )
    
    token = credentials.credentials
    supabase = get_supabase_anon()
    
    if not supabase:
        if settings.ENVIRONMENT == "development":
            return {"id": "00000000-0000-0000-0000-000000000000", "email": "dev@oxazoline-hub.org", "role": "authenticated"}
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unconfigured"
        )
    
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token"
            )
        return {
            "id": user_response.user.id,
            "email": user_response.user.email,
            "role": user_response.user.role or "authenticated"
        }
    except Exception as e:
        logger.error(f"Auth verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

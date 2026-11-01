import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "POx Research Hub API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
    
    # Supabase (Cloud Database & Auth)
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # Google Gemini AI
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-flash-latest"
    
    # Scientific Literature APIs
    OPENALEX_EMAIL: str = "researcher@oxazoline-hub.org"
    CROSSREF_EMAIL: str = "researcher@oxazoline-hub.org"
    SEMANTIC_SCHOLAR_API_KEY: str = ""
    
    # Security / Cron Secret for automated collection
    CRON_SECRET: str = "pox-research-hub-cron-secret-key"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

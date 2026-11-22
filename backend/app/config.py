from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Portfolio CMS API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = "super-secret-developer-jwt-key-change-in-production-portfolio-cms-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database: check current directory or parent directory for portfolio.db
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'portfolio.db')).replace('\\', '/')}"
        if os.path.exists(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'portfolio.db')))
        else f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'portfolio.db')).replace('\\', '/')}"
    )
    
    # Storage (Cloudinary default credentials with environment override)
    CLOUDINARY_URL: Optional[str] = os.getenv("CLOUDINARY_URL", None)
    CLOUDINARY_CLOUD_NAME: Optional[str] = os.getenv("CLOUDINARY_CLOUD_NAME", "glpoxplc")
    CLOUDINARY_API_KEY: Optional[str] = os.getenv("CLOUDINARY_API_KEY", "555972184652529")
    CLOUDINARY_API_SECRET: Optional[str] = os.getenv("CLOUDINARY_API_SECRET", "oqdA6o5efjZvQecPciWFifuMZH4")
    
    # Local Uploads directory
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

    model_config = SettingsConfigDict(
        env_file=(
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
            ".env"
        ),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()


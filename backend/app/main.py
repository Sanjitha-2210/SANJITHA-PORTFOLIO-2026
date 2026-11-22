import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.storage import ensure_upload_dir

from app.routers import (
    auth,
    public,
    admin_projects,
    admin_skills,
    admin_experience,
    admin_education,
    admin_milestones,
    admin_certifications,
    admin_profile,
    admin_messages,
    admin_stats,
    upload
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables and seed initial data
    Base.metadata.create_all(bind=engine)
    ensure_upload_dir()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origin_regex=r"^https?://.*$",  # Supports localhost, Vercel deployments, Render, and custom domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for local static file serving
ensure_upload_dir()
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(public.router, prefix=settings.API_V1_STR)
app.include_router(admin_projects.router, prefix=settings.API_V1_STR)
app.include_router(admin_skills.router, prefix=settings.API_V1_STR)
app.include_router(admin_experience.router, prefix=settings.API_V1_STR)
app.include_router(admin_education.router, prefix=settings.API_V1_STR)
app.include_router(admin_milestones.router, prefix=settings.API_V1_STR)
app.include_router(admin_certifications.router, prefix=settings.API_V1_STR)
app.include_router(admin_profile.router, prefix=settings.API_V1_STR)
app.include_router(admin_messages.router, prefix=settings.API_V1_STR)
app.include_router(admin_stats.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }


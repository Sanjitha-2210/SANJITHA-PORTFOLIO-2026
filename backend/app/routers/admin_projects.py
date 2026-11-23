import re
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Project, User
from app.schemas import ProjectOut, ProjectCreate, ProjectUpdate
from app.auth import get_current_user

router = APIRouter(prefix="/admin/projects", tags=["Admin Projects"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

@router.get("", response_model=List[ProjectOut])
def list_admin_projects(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Project)
    if status and status != "all":
        query = query.filter(Project.status == status)
    return query.order_by(Project.order_index.asc(), Project.id.desc()).all()

@router.post("", response_model=ProjectOut)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    raw_slug = (payload.slug or "").strip()
    slug = slugify(raw_slug) if raw_slug else slugify(payload.title)
    if not slug:
        slug = f"project-{db.query(Project).count() + 1}"
    
    # Check if slug exists
    existing = db.query(Project).filter(Project.slug == slug).first()
    if existing:
        slug = f"{slug}-{db.query(Project).count() + 1}"

    project = Project(
        title=payload.title,
        slug=slug,
        summary=payload.summary,
        description=payload.description,
        category=payload.category,
        tags=payload.tags,
        featured_image=payload.featured_image,
        demo_url=payload.demo_url,
        github_url=payload.github_url,
        video_url=payload.video_url,
        is_featured=payload.is_featured,
        status=payload.status,
        order_index=payload.order_index
    )
    try:
        db.add(project)
        db.commit()
        db.refresh(project)
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database create failed: {str(err)}")
    return project

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = payload.model_dump(exclude_unset=True)

    # Sanitize and ensure valid slug
    if "slug" in update_data:
        raw_slug = (update_data["slug"] or "").strip()
        new_title = update_data.get("title") or project.title
        candidate_slug = slugify(raw_slug) if raw_slug else slugify(new_title)
        if not candidate_slug:
            candidate_slug = f"project-{project_id}"
            
        conflict = db.query(Project).filter(Project.slug == candidate_slug, Project.id != project_id).first()
        if conflict:
            candidate_slug = f"{candidate_slug}-{project_id}"
        update_data["slug"] = candidate_slug
    elif not project.slug:
        candidate_slug = slugify(project.title) or f"project-{project_id}"
        conflict = db.query(Project).filter(Project.slug == candidate_slug, Project.id != project_id).first()
        if conflict:
            candidate_slug = f"{candidate_slug}-{project_id}"
        update_data["slug"] = candidate_slug

    for field, value in update_data.items():
        setattr(project, field, value)

    try:
        db.commit()
        db.refresh(project)
    except Exception as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database update failed: {str(err)}")

    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}


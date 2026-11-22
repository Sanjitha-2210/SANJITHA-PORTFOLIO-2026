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
    slug = payload.slug.strip() if payload.slug else slugify(payload.title)
    
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
    db.add(project)
    db.commit()
    db.refresh(project)
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
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
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


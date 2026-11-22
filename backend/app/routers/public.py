from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.database import get_db
from app.models import Profile, Project, Skill, Experience, Certification, Education, Message, Milestone
from app.schemas import (
    ProfileOut, ProjectOut, SkillOut, ExperienceOut, 
    CertificationOut, EducationOut, MessageCreate, MessageOut, MilestoneOut
)

router = APIRouter(prefix="/public", tags=["Public API"])

@router.get("/profile", response_model=ProfileOut)
def get_public_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not configured")
    return profile

@router.get("/projects", response_model=List[ProjectOut])
def get_public_projects(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Rule: Draft and archived content must not appear publicly
    query = db.query(Project).filter(Project.status == "published")
    
    if category and category != "All":
        query = query.filter(Project.category == category)
        
    if tag:
        query = query.filter(Project.tags.ilike(f"%{tag}%"))
        
    if q:
        search_filter = or_(
            Project.title.ilike(f"%{q}%"),
            Project.summary.ilike(f"%{q}%"),
            Project.tags.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)
        
    return query.order_by(Project.order_index.asc(), Project.created_at.desc()).all()

@router.get("/projects/{slug}", response_model=ProjectOut)
def get_public_project_by_slug(slug: str, db: Session = Depends(get_db)):
    # Rule: Draft and archived content must not appear publicly
    project = db.query(Project).filter(
        Project.slug == slug,
        Project.status == "published"
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not published")
    return project

@router.get("/skills", response_model=List[SkillOut])
def get_public_skills(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Skill).filter(Skill.status == "published")
    if category and category != "All":
        query = query.filter(Skill.category == category)
    return query.order_by(Skill.order_index.asc(), Skill.name.asc()).all()

@router.get("/experience", response_model=List[ExperienceOut])
def get_public_experience(db: Session = Depends(get_db)):
    return db.query(Experience).filter(
        Experience.status == "published"
    ).order_by(Experience.order_index.asc(), Experience.id.desc()).all()

@router.get("/certifications", response_model=List[CertificationOut])
def get_public_certifications(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Certification).filter(Certification.status == "published")
    if category and category != "All":
        query = query.filter(Certification.category == category)
    return query.order_by(Certification.order_index.asc(), Certification.id.desc()).all()

@router.get("/education", response_model=List[EducationOut])
def get_public_education(db: Session = Depends(get_db)):
    return db.query(Education).filter(
        Education.status == "published"
    ).order_by(Education.order_index.asc(), Education.id.asc()).all()

@router.get("/milestones", response_model=List[MilestoneOut])
def get_public_milestones(db: Session = Depends(get_db)):
    return db.query(Milestone).order_by(Milestone.year.asc(), Milestone.order_index.asc(), Milestone.id.asc()).all()

@router.post("/contact", response_model=dict)
def submit_contact_form(payload: MessageCreate, db: Session = Depends(get_db)):
    msg = Message(
        name=payload.name,
        email=payload.email,
        subject=payload.subject or "Portfolio Inquiry",
        message=payload.message
    )
    db.add(msg)
    db.commit()
    return {"status": "success", "message": "Thank you! Your message has been sent successfully."}


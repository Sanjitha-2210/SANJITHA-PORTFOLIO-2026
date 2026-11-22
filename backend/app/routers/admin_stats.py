from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Project, Skill, Experience, Certification, Message, User
from app.schemas import DashboardStats
from app.auth import get_current_user

router = APIRouter(prefix="/admin/stats", tags=["Admin Statistics"])

@router.get("", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_projects = db.query(Project).count()
    published_projects = db.query(Project).filter(Project.status == "published").count()
    draft_projects = db.query(Project).filter(Project.status == "draft").count()
    archived_projects = db.query(Project).filter(Project.status == "archived").count()
    
    total_skills = db.query(Skill).count()
    total_experience = db.query(Experience).count()
    total_certifications = db.query(Certification).count()
    
    unread_messages = db.query(Message).filter(Message.is_read == False).count()
    total_messages = db.query(Message).count()
    
    return {
        "total_projects": total_projects,
        "published_projects": published_projects,
        "draft_projects": draft_projects,
        "archived_projects": archived_projects,
        "total_skills": total_skills,
        "total_experience": total_experience,
        "total_certifications": total_certifications,
        "unread_messages": unread_messages,
        "total_messages": total_messages
    }


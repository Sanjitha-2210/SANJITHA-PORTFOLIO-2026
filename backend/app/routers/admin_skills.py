from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Skill, User
from app.schemas import SkillOut, SkillCreate, SkillUpdate
from app.auth import get_current_user

router = APIRouter(prefix="/admin/skills", tags=["Admin Skills"])

@router.get("", response_model=List[SkillOut])
def list_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Skill).order_by(Skill.order_index.asc(), Skill.id.desc()).all()

@router.post("", response_model=SkillOut)
def create_skill(
    payload: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skill = Skill(**payload.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill

@router.put("/{skill_id}", response_model=SkillOut)
def update_skill(
    skill_id: int,
    payload: SkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
        
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)
        
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
        
    db.delete(skill)
    db.commit()
    return {"message": "Skill deleted successfully"}


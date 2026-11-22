from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Experience, User
from app.schemas import ExperienceOut, ExperienceCreate, ExperienceUpdate
from app.auth import get_current_user

router = APIRouter(prefix="/admin/experience", tags=["Admin Experience"])

@router.get("", response_model=List[ExperienceOut])
def list_experience(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Experience).order_by(Experience.order_index.asc(), Experience.id.desc()).all()

@router.post("", response_model=ExperienceOut)
def create_experience(
    payload: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exp = Experience(**payload.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp

@router.put("/{exp_id}", response_model=ExperienceOut)
def update_experience(
    exp_id: int,
    payload: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
        
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(exp, field, value)
        
    db.commit()
    db.refresh(exp)
    return exp

@router.delete("/{exp_id}")
def delete_experience(
    exp_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
        
    db.delete(exp)
    db.commit()
    return {"message": "Experience deleted successfully"}


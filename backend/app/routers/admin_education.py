from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Education, User
from app.schemas import EducationOut, EducationCreate, EducationUpdate
from app.auth import get_current_user

router = APIRouter(prefix="/admin/education", tags=["Admin Education"])

@router.get("", response_model=List[EducationOut])
def list_education(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Education).order_by(Education.order_index.asc(), Education.id.asc()).all()

@router.post("", response_model=EducationOut)
def create_education(
    payload: EducationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = Education(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/{education_id}", response_model=EducationOut)
def get_education(
    education_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Education).filter(Education.id == education_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Education record not found")
    return item

@router.put("/{education_id}", response_model=EducationOut)
def update_education(
    education_id: int,
    payload: EducationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Education).filter(Education.id == education_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Education record not found")
        
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
        
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{education_id}")
def delete_education(
    education_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Education).filter(Education.id == education_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Education record not found")
        
    db.delete(item)
    db.commit()
    return {"message": "Education record deleted successfully"}


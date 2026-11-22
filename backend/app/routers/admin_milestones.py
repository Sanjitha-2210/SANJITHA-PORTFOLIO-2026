from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Milestone, User
from app.schemas import MilestoneOut, MilestoneCreate, MilestoneUpdate
from app.auth import get_current_user

router = APIRouter(prefix="/admin/milestones", tags=["Admin Milestones"])

@router.get("", response_model=List[MilestoneOut])
def list_milestones(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Milestone).order_by(Milestone.year.asc(), Milestone.order_index.asc(), Milestone.id.asc()).all()

@router.post("", response_model=MilestoneOut)
def create_milestone(
    payload: MilestoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = Milestone(**payload.model_dump())
    # Automatically compute pct if not specified or 0 and year is between 2022 and 2028
    if item.pct == 0.0 and item.year != 2022 and 2022 <= item.year <= 2028:
        item.pct = round(((item.year - 2022) / (2028 - 2022)) * 100, 2)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/{milestone_id}", response_model=MilestoneOut)
def get_milestone(
    milestone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return item

@router.put("/{milestone_id}", response_model=MilestoneOut)
def update_milestone(
    milestone_id: int,
    payload: MilestoneUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Milestone not found")
        
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
        
    # Recalculate pct if year changed and pct was not explicitly passed
    if "year" in payload.model_dump(exclude_unset=True) and "pct" not in payload.model_dump(exclude_unset=True):
        if 2022 <= item.year <= 2028:
            item.pct = round(((item.year - 2022) / (2028 - 2022)) * 100, 2)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{milestone_id}")
def delete_milestone(
    milestone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Milestone not found")
        
    db.delete(item)
    db.commit()
    return {"message": "Milestone deleted successfully"}


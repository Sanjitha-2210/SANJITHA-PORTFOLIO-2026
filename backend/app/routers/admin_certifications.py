from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Certification, User
from app.schemas import CertificationOut, CertificationCreate, CertificationUpdate
from app.auth import get_current_user

router = APIRouter(prefix="/admin/certifications", tags=["Admin Certifications"])

@router.get("", response_model=List[CertificationOut])
def list_certifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Certification).order_by(Certification.order_index.asc(), Certification.id.desc()).all()

@router.post("", response_model=CertificationOut)
def create_certification(
    payload: CertificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cert = Certification(**payload.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert

@router.put("/{cert_id}", response_model=CertificationOut)
def update_certification(
    cert_id: int,
    payload: CertificationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")
        
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(cert, field, value)
        
    db.commit()
    db.refresh(cert)
    return cert

@router.delete("/{cert_id}")
def delete_certification(
    cert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")
        
    db.delete(cert)
    db.commit()
    return {"message": "Certification deleted successfully"}


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Message, User
from app.schemas import MessageOut
from app.auth import get_current_user

router = APIRouter(prefix="/admin/messages", tags=["Admin Messages"])

@router.get("", response_model=List[MessageOut])
def list_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Message).order_by(Message.is_read.asc(), Message.created_at.desc()).all()

@router.put("/{message_id}/toggle-read")
def toggle_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
        
    msg.is_read = not msg.is_read
    db.commit()
    return {"message_id": msg.id, "is_read": msg.is_read}

@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
        
    db.delete(msg)
    db.commit()
    return {"message": "Message deleted successfully"}


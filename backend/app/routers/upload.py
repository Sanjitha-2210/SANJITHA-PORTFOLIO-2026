from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.models import User
from app.auth import get_current_user
from app.storage import save_uploaded_media

router = APIRouter(prefix="/upload", tags=["Media Upload"])

@router.post("")
async def upload_media(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Allowed extensions: images, pdf, videos (including full-fidelity MP4, WebM, MOV, MKV)
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf", ".mp4", ".webm", ".mov", ".mkv", ".m4v", ".avi"}
    import os
    ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"File extension '{ext}' is not permitted")
        
    result = await save_uploaded_media(file)
    return result


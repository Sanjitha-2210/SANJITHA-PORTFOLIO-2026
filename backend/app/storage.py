import os
import uuid
import shutil
from fastapi import UploadFile
from app.config import settings

# Initialize cloudinary if configured
is_cloudinary_configured = bool(
    settings.CLOUDINARY_URL or (
        settings.CLOUDINARY_CLOUD_NAME and 
        settings.CLOUDINARY_API_KEY and 
        settings.CLOUDINARY_API_SECRET
    )
)

if is_cloudinary_configured:
    import cloudinary
    import cloudinary.uploader
    if settings.CLOUDINARY_URL:
        # Load from full connection string if provided
        os.environ["CLOUDINARY_URL"] = settings.CLOUDINARY_URL
        cloudinary.reset_config()
    else:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True
        )

def ensure_upload_dir():
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

async def save_uploaded_media(file: UploadFile) -> dict:
    ensure_upload_dir()
    
    # Check if Cloudinary is configured
    if is_cloudinary_configured:
        try:
            import cloudinary.uploader
            upload_result = cloudinary.uploader.upload(
                file.file,
                folder="portfolio_cms",
                resource_type="auto"
            )
            return {
                "url": upload_result.get("secure_url"),
                "storage": "cloudinary",
                "format": upload_result.get("format"),
                "resource_type": upload_result.get("resource_type"),
                "original_filename": file.filename
            }
        except Exception as e:
            print(f"Cloudinary upload failed, falling back to local: {e}")
            # Fallback to local
    
    # Local storage fallback
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
    unique_name = f"{uuid.uuid4().hex}{file_ext}"
    dest_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    
    file.file.seek(0)
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Local URL served via FastAPI static mount
    return {
        "url": f"/uploads/{unique_name}",
        "storage": "local",
        "format": file_ext.replace(".", ""),
        "resource_type": "image" if file.content_type and "image" in file.content_type else "raw",
        "original_filename": file.filename
    }


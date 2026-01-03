from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from typing import List
import shutil
import os
from pathlib import Path
import uuid
from app.auth.dependencies import get_current_active_user
from app.models import User

router = APIRouter()

UPLOAD_DIR = Path("static")
PROFILE_PICTURES_DIR = UPLOAD_DIR / "profile_pictures"
RESUMES_DIR = UPLOAD_DIR / "resumes"
CERTIFICATIONS_DIR = UPLOAD_DIR / "certifications"

# Ensure directories exist
PROFILE_PICTURES_DIR.mkdir(parents=True, exist_ok=True)
RESUMES_DIR.mkdir(parents=True, exist_ok=True)
CERTIFICATIONS_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/profile-picture", response_model=dict)
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload a profile picture.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = PROFILE_PICTURES_DIR / file_name
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/static/profile_pictures/{file_name}"}

@router.post("/resume", response_model=dict)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload a resume (PDF or Word doc).
    """
    allowed_types = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="File must be a PDF or Word document")
    
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = RESUMES_DIR / file_name
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/static/resumes/{file_name}"}

@router.post("/certification", response_model=dict)
async def upload_certification(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Upload a certification document/image.
    """
    # Allow images and PDFs
    allowed_types = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="File must be an image or PDF")
    
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = CERTIFICATIONS_DIR / file_name
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/static/certifications/{file_name}"}
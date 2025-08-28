from fastapi import APIRouter, UploadFile, File, HTTPException, status
from utils.cloudinaryconfig import upload_to_cloudinary
import tempfile
import os
from contextlib import asynccontextmanager
from typing import Dict, Set


router = APIRouter()

ALLOWED_EXTENSIONS: Set[str] = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".tiff", ".svg"}


@asynccontextmanager
async def temp_file_manager(file: UploadFile, file_ext: str):
    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        yield temp_file_path
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)


def validate_file_extension(filename: str) -> str:
    file_ext = os.path.splitext(filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only image files are allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )
    return file_ext


@router.post("/")
async def upload_image(file: UploadFile = File(...)) -> Dict[str, str]:
    file_ext = validate_file_extension(file.filename)
    
    try:
        async with temp_file_manager(file, file_ext) as temp_file_path:
            image_url = upload_to_cloudinary(temp_file_path, file.filename)
            return {"image_url": image_url, "filename": file.filename}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
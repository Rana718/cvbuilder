from fastapi import APIRouter

from .public_route import cv_gen, shared
from . import auth, resumeop, upload, coverletter
from .public_route import publicrouter


mainrouter = APIRouter()

mainrouter.include_router(upload.router, prefix="/upload", tags=["File Upload"])
mainrouter.include_router(auth.router, prefix="/auth", tags=["Authentication"])
mainrouter.include_router(resumeop.app, prefix="/resume-op", tags=["Resume Operations"])
mainrouter.include_router(publicrouter, prefix="/public", tags=["Public Access"])
mainrouter.include_router(coverletter.router, prefix="/cover-letters", tags=["Cover Letters"])

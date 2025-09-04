from fastapi import APIRouter

from .public_route import cv_gen, shared
from . import auth, resumeop, upload, coverletter, rayzorpay, admin
from .public_route import publicrouter
from .linkedin_auth import linkedinauth


mainrouter = APIRouter()

mainrouter.include_router(upload.router, prefix="/upload", tags=["File Upload"])
mainrouter.include_router(auth.router, prefix="/auth", tags=["Authentication"])
mainrouter.include_router(resumeop.app, prefix="/resume-op", tags=["Resume Operations"])
mainrouter.include_router(publicrouter, prefix="/public", tags=["Public Access"])
mainrouter.include_router(coverletter.router, prefix="/cover-letters", tags=["Cover Letters"])
mainrouter.include_router(linkedinauth, prefix="/linkedin", tags=["LinkedIn Integration"])
mainrouter.include_router(rayzorpay.router, prefix="/payment", tags=["Payment"])
mainrouter.include_router(admin.router, prefix="/admin", tags=["Admin"])

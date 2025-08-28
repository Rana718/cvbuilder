from fastapi import APIRouter
from . import cv_gen, auth, resumeop


mainrouter = APIRouter()

mainrouter.include_router(auth.router, prefix="/auth", tags=["Authentication"])
mainrouter.include_router(cv_gen.router, prefix="/cv-gen", tags=["CV Generation"])
mainrouter.include_router(resumeop.app, prefix="/resume-op", tags=["Resume Operations"])
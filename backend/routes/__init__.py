from fastapi import APIRouter

from . import auth, resumeop, upload, coverletter, rayzorpay, dashboard, cv_parser, plans, blog
from .admin import adminRouter
from .public_route import publicrouter
from .linkedin_auth import linkedinauth


mainrouter = APIRouter()

mainrouter.include_router(upload.router, prefix="/upload", tags=["File Upload"])
mainrouter.include_router(auth.router, prefix="/auth", tags=["Authentication"])
mainrouter.include_router(resumeop.app, prefix="/resume-op", tags=["Resume Operations"])
mainrouter.include_router(dashboard.app, prefix="/dashboard", tags=["Dashboard"])
mainrouter.include_router(publicrouter, prefix="/public", tags=["Public Access"])
mainrouter.include_router(coverletter.router, prefix="/cover-letters", tags=["Cover Letters"])
mainrouter.include_router(linkedinauth, prefix="/linkedin", tags=["LinkedIn Integration"])
mainrouter.include_router(rayzorpay.router, prefix="/payment", tags=["Payment"])
mainrouter.include_router(plans.router, prefix="/plans", tags=["Plans"])
mainrouter.include_router(blog.router, prefix="/blog", tags=["Blog"])
mainrouter.include_router(adminRouter, prefix="/admin", tags=["Admin Operations"])
mainrouter.include_router(cv_parser.router, prefix="/cv-parser", tags=["CV Parser"])
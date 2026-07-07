from fastapi import APIRouter
from . import linkdin, razorpay


callbackrouter = APIRouter()

callbackrouter.include_router(linkdin.linkedinroute, prefix="/linkedin", tags=["LinkedIn Callbacks"])
callbackrouter.include_router(razorpay.razorypayrouter, prefix="/razorpay", tags=["LinkedIn Callbacks"])
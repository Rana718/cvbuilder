from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import select
from db.db import get_db
from db.scheme import User, LinkedInProfile
from models.linkedin_models import LinkedInConnectionStatus, LinkedInProfileResponse
from utils.auth_utils import get_current_user_from_request
from datetime import datetime
import os
import urllib.parse

linkedinauth = APIRouter()

CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI")

@linkedinauth.get("/status", response_model=LinkedInConnectionStatus)
async def get_linkedin_status(
    request: Request,
    db: Session = Depends(get_db)
):
    """Get LinkedIn connection status for the authenticated user"""
    try:
        # Get database user from Firebase UID
        user = await get_current_user_from_request(request, db)
        user_id = user.id
        
        # Check if user has LinkedIn profile connected
        result = await db.execute(
            select(LinkedInProfile).where(
                LinkedInProfile.user_id == user_id,
                LinkedInProfile.is_connected == True
            )
        )
        linkedin_profile = result.scalar_one_or_none()
        
        if linkedin_profile:
            return LinkedInConnectionStatus(
                is_connected=True,
                connected_at=linkedin_profile.connected_at,
                last_synced_at=linkedin_profile.last_synced_at,
                profile_url=linkedin_profile.profile_url,
                headline=linkedin_profile.headline
            )
        else:
            return LinkedInConnectionStatus(is_connected=False)
    except Exception as e:
        print(f"Error fetching LinkedIn status: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch LinkedIn status")


@linkedinauth.get("/connect-url")
async def get_linkedin_connect_url(request: Request, db: Session = Depends(get_db)):
    """Get LinkedIn OAuth URL for connecting account"""
    try:
        # Get database user from Firebase UID
        user = await get_current_user_from_request(request, db)
        user_id = user.id
        
        print(f"DEBUG: LinkedIn connect-url called with database user_id: {user_id}")
        
        # LinkedIn OAuth URL
        base_url = "https://www.linkedin.com/oauth/v2/authorization"
        params = {
            "response_type": "code",
            "client_id": CLIENT_ID,
            "redirect_uri": REDIRECT_URI,
            "state": str(user_id),  # Pass database user_id as state
            "scope": "openid profile email"  # Use only basic scopes
        }
        
        auth_url = f"{base_url}?{urllib.parse.urlencode(params)}"
        
        print(f"DEBUG: Generated LinkedIn auth URL: {auth_url}")
        
        return {
            "auth_url": auth_url,
            "state": str(user_id)
        }
    except Exception as e:
        print(f"Error generating LinkedIn connect URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate connect URL")


@linkedinauth.get("/profile", response_model=LinkedInProfileResponse)
async def get_linkedin_profile(
    request: Request,
    db: Session = Depends(get_db)
):
    """Get LinkedIn profile data for the authenticated user"""
    user = await get_current_user_from_request(request, db)
    user_id = user.id
    
    result = await db.execute(
        select(LinkedInProfile).where(
            LinkedInProfile.user_id == user_id,
            LinkedInProfile.is_connected == True
        )
    )
    linkedin_profile = result.scalar_one_or_none()
    
    if not linkedin_profile:
        raise HTTPException(status_code=404, detail="LinkedIn profile not connected")
    
    return LinkedInProfileResponse.from_orm(linkedin_profile)


@linkedinauth.delete("/disconnect")
async def disconnect_linkedin(
    request: Request,
    db: Session = Depends(get_db)
):
    """Disconnect LinkedIn profile from user account"""
    user = await get_current_user_from_request(request, db)
    user_id = user.id
    
    result = await db.execute(
        select(LinkedInProfile).where(LinkedInProfile.user_id == user_id)
    )
    linkedin_profile = result.scalar_one_or_none()
    
    if not linkedin_profile:
        raise HTTPException(status_code=404, detail="LinkedIn profile not found")
    
    # Mark as disconnected instead of deleting
    linkedin_profile.is_connected = False
    linkedin_profile.updated_at = datetime.utcnow()
    
    try:
        await db.commit()
        return {"message": "LinkedIn profile disconnected successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to disconnect LinkedIn profile")


@linkedinauth.post("/sync")
async def sync_linkedin_profile(
    request: Request,
    db: Session = Depends(get_db)
):
    """Sync LinkedIn profile data (refresh from LinkedIn API)"""
    user = await get_current_user_from_request(request, db)
    user_id = user.id
    
    result = await db.execute(
        select(LinkedInProfile).where(
            LinkedInProfile.user_id == user_id,
            LinkedInProfile.is_connected == True
        )
    )
    linkedin_profile = result.scalar_one_or_none()
    
    if not linkedin_profile:
        raise HTTPException(status_code=404, detail="LinkedIn profile not connected")
    
    # TODO: Implement actual sync with LinkedIn API using stored access token
    # For now, just update the last_synced_at timestamp
    linkedin_profile.last_synced_at = datetime.utcnow()
    linkedin_profile.updated_at = datetime.utcnow()
    
    try:
        await db.commit()
        return {"message": "LinkedIn profile sync initiated", "last_synced_at": linkedin_profile.last_synced_at}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to sync LinkedIn profile")

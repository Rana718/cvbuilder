from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
import httpx
import os
import logging
from datetime import datetime, timedelta
from db.db import get_db
from db.scheme import User, LinkedInProfile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

linkedinroute = APIRouter()

CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


@linkedinroute.get("/auth/callback")
async def linkedin_callback(request: Request, db: Session = Depends(get_db)):
    code = request.query_params.get("code")
    state = request.query_params.get("state")  # This contains the database user_id
    error = request.query_params.get("error")
    error_description = request.query_params.get("error_description")

    logger.info(f"Received LinkedIn callback request with code={code}, state={state}, error={error}")

    if error:
        logger.error(f"LinkedIn OAuth error: {error} - {error_description}")
        # Redirect to profile page with error
        return RedirectResponse(url=f"{FRONTEND_URL}/profile?linkedin_error={error}", status_code=302)

    if not code or not state:
        logger.error("Missing 'code' or 'state' in query params")
        return RedirectResponse(url=f"{FRONTEND_URL}/profile?linkedin_error=missing_params", status_code=302)

    # Get user from database using state (user_id)
    try:
        user_id = int(state)
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user:
            logger.error(f"User not found for user_id: {user_id}")
            return RedirectResponse(url=f"{FRONTEND_URL}/profile?linkedin_error=user_not_found", status_code=302)
            
        logger.info(f"Processing LinkedIn callback for user: {user.email}")
    except (ValueError, TypeError) as e:
        logger.error(f"Invalid state parameter: {state} - {e}")
        return RedirectResponse(url=f"{FRONTEND_URL}/profile?linkedin_error=invalid_state", status_code=302)

    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    logger.info(f"Requesting access token from LinkedIn: {token_url}")

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            token_url,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": REDIRECT_URI,
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

    logger.info(f"Access token response status: {token_resp.status_code}")
    
    if token_resp.status_code != 200:
        logger.error(f"Failed to get access token: {token_resp.text}")
        return RedirectResponse(url=f"{FRONTEND_URL}/profile?linkedin_error=token_failed", status_code=302)

    token_data = token_resp.json()
    access_token = token_data.get("access_token")
    expires_in = token_data.get("expires_in", 5184000)  # Default 60 days

    if not access_token:
        logger.error("Failed to get access token from LinkedIn")
        return RedirectResponse(url=f"{FRONTEND_URL}/profile?linkedin_error=no_access_token", status_code=302)

    logger.info(f"Access token received successfully")

    # Get user profile information from LinkedIn
    async with httpx.AsyncClient() as client:
        userinfo_resp = await client.get(
            "https://api.linkedin.com/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        
        basic_profile_resp = await client.get(
            "https://api.linkedin.com/v2/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )

    logger.info(f"Userinfo response status: {userinfo_resp.status_code}")
    logger.info(f"Basic profile response status: {basic_profile_resp.status_code}")
    
    if userinfo_resp.status_code != 200:
        logger.error(f"Failed to get user info: {userinfo_resp.text}")
        return RedirectResponse(url=f"{FRONTEND_URL}/profile?linkedin_error=profile_failed", status_code=302)

    userinfo_data = userinfo_resp.json()
    basic_profile_data = basic_profile_resp.json() if basic_profile_resp.status_code == 200 else {}
    
    logger.info(f"LinkedIn userinfo response: {userinfo_data}")
    logger.info(f"LinkedIn basic profile response: {basic_profile_data}")

    # Store LinkedIn profile data in database
    try:
        # Calculate token expiration
        token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
        
        # Extract data from userinfo_data with safe access
        linkedin_id = userinfo_data.get("sub")
        first_name = userinfo_data.get("given_name")
        last_name = userinfo_data.get("family_name")
        email_address = userinfo_data.get("email")
        name = userinfo_data.get("name")
        email_verified = userinfo_data.get("email_verified")
        
        # Handle locale object properly
        locale_data = userinfo_data.get("locale")
        locale_country = None
        locale_language = None
        if isinstance(locale_data, dict):
            locale_country = locale_data.get("country")
            locale_language = locale_data.get("language")
        
        # Extract picture URL (not in current data but handle if present)
        picture_url = userinfo_data.get("picture")
        
        # Extract basic profile data (currently empty but handle if present)
        headline = basic_profile_data.get("headline") if basic_profile_data else None
        location = None
        if basic_profile_data and basic_profile_data.get("location"):
            if isinstance(basic_profile_data.get("location"), dict):
                location = basic_profile_data.get("location").get("name")
            else:
                location = basic_profile_data.get("location")
        industry = basic_profile_data.get("industry") if basic_profile_data else None
        summary = basic_profile_data.get("summary") if basic_profile_data else None
        
        # Check if LinkedIn profile already exists
        result = await db.execute(
            select(LinkedInProfile).where(LinkedInProfile.user_id == user.id)
        )
        existing_profile = result.scalar_one_or_none()
        
        if existing_profile:
            # Update existing profile with only available data
            existing_profile.linkedin_id = linkedin_id
            existing_profile.access_token = access_token
            existing_profile.token_expires_at = token_expires_at
            existing_profile.first_name = first_name
            existing_profile.last_name = last_name
            existing_profile.email_address = email_address
            existing_profile.picture_url = picture_url
            existing_profile.headline = headline
            existing_profile.location = location
            existing_profile.industry = industry
            existing_profile.summary = summary
            existing_profile.is_connected = True
            existing_profile.connected_at = datetime.utcnow()
            existing_profile.last_synced_at = datetime.utcnow()
            
            logger.info(f"Updated existing LinkedIn profile for user: {user.email}")
        else:
            # Create new LinkedIn profile with only available data
            new_profile = LinkedInProfile(
                user_id=user.id,
                linkedin_id=linkedin_id,
                access_token=access_token,
                token_expires_at=token_expires_at,
                first_name=first_name,
                last_name=last_name,
                email_address=email_address,
                picture_url=picture_url,
                headline=headline,
                location=location,
                industry=industry,
                summary=summary,
                is_connected=True,
                connected_at=datetime.utcnow(),
                last_synced_at=datetime.utcnow()
            )
            
            db.add(new_profile)
            logger.info(f"Created new LinkedIn profile for user: {user.email}")
        
        await db.commit()
        logger.info(f"Successfully stored LinkedIn profile data for user: {user.email}")
        
        # Redirect to profile page with success
        return RedirectResponse(url=f"{FRONTEND_URL}/profile?linkedin_success=true", status_code=302)
        
    except Exception as e:
        logger.error(f"Failed to store LinkedIn profile data: {e}")
        await db.rollback()
        return RedirectResponse(url=f"{FRONTEND_URL}/profile?linkedin_error=storage_failed", status_code=302)
from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


class LinkedInAuthRequest(BaseModel):
    """Model for LinkedIn authentication request"""
    code: str
    state: Optional[str] = None


class LinkedInProfileData(BaseModel):
    """Model for LinkedIn profile data from API"""
    linkedin_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email_address: Optional[str] = None
    profile_url: Optional[str] = None
    picture_url: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    industry: Optional[str] = None
    summary: Optional[str] = None


class LinkedInTokenData(BaseModel):
    """Model for LinkedIn token data"""
    access_token: str
    refresh_token: Optional[str] = None
    expires_in: Optional[int] = None
    token_type: Optional[str] = "Bearer"


class LinkedInProfileResponse(BaseModel):
    """Model for LinkedIn profile response"""
    id: int
    user_id: int
    linkedin_id: str
    profile_url: Optional[str] = None
    picture_url: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    industry: Optional[str] = None
    summary: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email_address: Optional[str] = None
    is_connected: bool
    connected_at: datetime
    last_synced_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LinkedInConnectionStatus(BaseModel):
    """Model for LinkedIn connection status"""
    is_connected: bool
    connected_at: Optional[datetime] = None
    last_synced_at: Optional[datetime] = None
    profile_url: Optional[str] = None
    headline: Optional[str] = None


class LinkedInDisconnectRequest(BaseModel):
    """Model for LinkedIn disconnect request"""
    confirm: bool = True

from pydantic import BaseModel, EmailStr
from typing import Optional

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class SigninRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    google_id: str
    email: EmailStr
    full_name: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse

class RefreshTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

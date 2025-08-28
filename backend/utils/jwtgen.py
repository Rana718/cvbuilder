import jwt
import os
from datetime import datetime, timedelta
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "top-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 6
REFRESH_TOKEN_EXPIRE_DAYS = 7

def create_access_token(user_id: int, email: str) -> str:
    """Create JWT access token"""
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode = {
        "sub": str(user_id),
        "email": email,
        "exp": expire,
        "type": "access"
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: int, email: str) -> str:
    """Create JWT refresh token"""
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {
        "sub": str(user_id),
        "email": email,
        "exp": expire,
        "type": "refresh"
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> Optional[dict]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None

def decode_access_token(token: str) -> Optional[dict]:
    """Decode access token and verify it's an access token"""
    payload = verify_token(token)
    if payload and payload.get("type") == "access":
        return payload
    return None

def decode_refresh_token(token: str) -> Optional[dict]:
    """Decode refresh token and verify it's a refresh token"""
    payload = verify_token(token)
    if payload and payload.get("type") == "refresh":
        return payload
    return None



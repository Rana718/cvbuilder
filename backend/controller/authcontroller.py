from typing import Dict, Any, Optional
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from db.scheme import User
from utils.jwtgen import create_access_token, create_refresh_token, decode_refresh_token
from db.db import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthController:
    
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def _generate_tokens(user_id: int, email: str) -> Dict[str, str]:
        return {
            "access_token": create_access_token(user_id, email),
            "refresh_token": create_refresh_token(user_id, email),
        }
    
    @staticmethod
    def _user_response(user: User) -> Dict[str, Any]:
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    
    @staticmethod
    async def _get_user_by_email(db: Session, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def signup(email: str, password: str, full_name: str = "") -> Dict[str, Any]:
        try:
            async for db in get_db():
                existing_user = await AuthController._get_user_by_email(db, email)
                if existing_user:
                    return {"success": False, "error": "User already exists"}
                
                user = User(
                    email=email,
                    password_hash=AuthController.hash_password(password),
                    full_name=full_name or email.split('@')[0]
                )
                
                db.add(user)
                await db.commit()
                await db.refresh(user)
                
                tokens = AuthController._generate_tokens(user.id, user.email)
                
                return {
                    "success": True,
                    "response": {
                        **tokens,
                        "user": AuthController._user_response(user)
                    }
                }
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def signin(email: str, password: str) -> Dict[str, Any]:
        try:
            async for db in get_db():
                user = await AuthController._get_user_by_email(db, email)
                
                if not user or not user.password_hash or not AuthController.verify_password(password, user.password_hash):
                    return {"success": False, "error": "Invalid credentials"}
                
                tokens = AuthController._generate_tokens(user.id, user.email)
                
                return {
                    "success": True,
                    "response": {
                        **tokens,
                        "user": AuthController._user_response(user)
                    }
                }
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def google_auth(google_id: str, email: str, full_name: str = "") -> Dict[str, Any]:
        try:
            async for db in get_db():
                result = await db.execute(
                    select(User).where(or_(User.email == email, User.google_id == google_id))
                )
                user = result.scalar_one_or_none()
                
                if user:
                    if not user.google_id:
                        user.google_id = google_id
                        await db.commit()
                else:
                    user = User(
                        email=email,
                        google_id=google_id,
                        full_name=full_name or email.split('@')[0]
                    )
                    db.add(user)
                    await db.commit()
                    await db.refresh(user)
                
                tokens = AuthController._generate_tokens(user.id, user.email)
                
                return {
                    "success": True,
                    "response": {
                        **tokens,
                        "user": AuthController._user_response(user)
                    }
                }
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def refresh_access_token(refresh_token: str) -> Dict[str, Any]:
        try:
            payload = decode_refresh_token(refresh_token)
            if not payload:
                return {"success": False, "error": "Invalid refresh token"}
            
            user_id = int(payload.get("sub"))
            
            async for db in get_db():
                result = await db.execute(select(User).where(User.id == user_id))
                user = result.scalar_one_or_none()
                
                if not user:
                    return {"success": False, "error": "User not found"}
                
                return {
                    "success": True,
                    "access_token": create_access_token(user.id, user.email),
                    "token_type": "bearer"
                }
                
        except Exception as e:
            return {"success": False, "error": "Invalid refresh token"}
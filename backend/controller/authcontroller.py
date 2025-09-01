from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from db.scheme import User
from config.firebase import set_custom_user_claims
from db.db import get_db
from models.auth_models import AddUserProfileRequest

class AuthController:
    
    @staticmethod
    async def AdduserDb(userdata: AddUserProfileRequest) -> Dict[str, Any]:
        try:
            async for db in get_db():
                # Check if user already exists
                result = await db.execute(
                    select(User).where(
                        or_(
                            User.email == userdata.email,
                            User.firebase_uid == userdata.firebase_uid
                        )
                    )
                )
                existing_user = result.scalar_one_or_none()
                
                if existing_user:
                    # Update existing user with new info if needed
                    updated = False
                    if existing_user.firebase_uid != userdata.firebase_uid:
                        existing_user.firebase_uid = userdata.firebase_uid
                        updated = True
                    if not existing_user.image_url and userdata.image_url:
                        existing_user.image_url = userdata.image_url
                        updated = True
                    if not existing_user.full_name and userdata.full_name:
                        existing_user.full_name = userdata.full_name
                        updated = True
                    if not existing_user.google_id and userdata.google_id:
                        existing_user.google_id = userdata.google_id
                        updated = True
                    
                    if updated:
                        await db.commit()
                        await db.refresh(existing_user)
                    
                    # Set custom claims with the correct UID
                    set_custom_user_claims(userdata.firebase_uid, {"dbUser": "true"})
                    
                    return {"success": True, "user": {
                        "id": existing_user.id,
                        "email": existing_user.email,
                        "full_name": existing_user.full_name,
                        "firebase_uid": existing_user.firebase_uid,
                        "image_url": existing_user.image_url,
                        "dbUser": "true"
                    }}
                
                # Create new user
                new_user = User(
                    email=userdata.email,
                    full_name=userdata.full_name or userdata.email.split('@')[0],
                    firebase_uid=userdata.firebase_uid,
                    google_id=userdata.google_id,
                    image_url=userdata.image_url
                )
                db.add(new_user)
                await db.commit()
                await db.refresh(new_user)

                # Set custom claims
                set_custom_user_claims(new_user.firebase_uid, {"dbUser": "true"})
                
                return {"success": True, "user": {
                    "id": new_user.id,
                    "email": new_user.email,
                    "full_name": new_user.full_name,
                    "firebase_uid": new_user.firebase_uid,
                    "image_url": new_user.image_url,
                    "dbUser": "true"
                }}

        except Exception as e:
            print(f"Error in AdduserDb: {e}")
            return {"success": False, "error": f"Database error: {str(e)}"}
       
    
    @staticmethod
    async def get_user_profile(firebase_uid: str, db: Session) -> Dict[str, Any]:
        """Get user profile by Firebase UID"""
        try:
            result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
            user = result.scalar_one_or_none()
            
            if not user:
                return {"success": False, "error": "User not found"}
            
            return {
                "success": True,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "firebase_uid": user.firebase_uid
                }
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to fetch user profile: {str(e)}"}

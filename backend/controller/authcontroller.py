from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from db.scheme import User
from config.firebase import set_custom_user_claims, remove_custom_user_claims
from db.db import get_db
from models.auth_models import AddUserProfileRequest
from datetime import datetime
import os

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
                    
                    # Update last login
                    existing_user.last_login = datetime.utcnow()
                    updated = True
                    
                    if updated:
                        await db.commit()
                        await db.refresh(existing_user)
                    
                    # Log login activity
                    
                    # Try to set custom claims with the correct UID
                    firebase_success = set_custom_user_claims(userdata.firebase_uid, {"dbUser": "true"})
                    
                    return {"success": True, "user": {
                        "id": existing_user.id,
                        "email": existing_user.email,
                        "full_name": existing_user.full_name,
                        "firebase_uid": existing_user.firebase_uid,
                        "image_url": existing_user.image_url,
                        "dbUser": "true",
                        "firebase_claims_set": firebase_success
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

                # Try to set custom claims
                firebase_success = set_custom_user_claims(new_user.firebase_uid, {"dbUser": "true"})
                
                return {"success": True, "user": {
                    "id": new_user.id,
                    "email": new_user.email,
                    "full_name": new_user.full_name,
                    "firebase_uid": new_user.firebase_uid,
                    "image_url": new_user.image_url,
                    "dbUser": "true",
                    "firebase_claims_set": firebase_success
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
        
    
    @staticmethod
    async def create_super_admin(email: str, secret_key: str, db: Session) -> Dict[str, Any]:
        """Create super admin using secret key"""
        try:
            admin_secret = os.getenv("ADMIN_SECRET_KEY")
            if not admin_secret or secret_key != admin_secret:
                return {"success": False, "error": "Invalid secret key"}
            
            # Get user by Firebase UID
            result = await db.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()
            
            if not user:
                return {"success": False, "error": "User not found"}
            
            # Make user super admin
            user.isSuperAdmin = True
            user.isAdmin = True  # Super admin is also admin
            await db.commit()
            await db.refresh(user)
            
            # Update Firebase custom claims with correct keys
            claims = {
                "isAdmin": True, 
                "isSuperAdmin": True,
                "dbUser": "true"
            }
            firebase_success = set_custom_user_claims(user.firebase_uid, claims)
            
            response_message = "Super admin created successfully"
            if not firebase_success:
                response_message += " (Note: Firebase custom claims could not be set - user may need to re-authenticate)"
            
            return {
                "success": True,
                "message": response_message,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "isAdmin": user.isAdmin,
                    "isSuperAdmin": user.isSuperAdmin
                }
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to create super admin: {str(e)}"}
    
    @staticmethod
    async def add_admin_by_super_admin(user_email: str, make_admin: bool, make_super_admin: bool, requesting_user: User, db: Session) -> Dict[str, Any]:
        """Add admin role by super admin only"""
        try:
            # Only super admins can add admins
            if not requesting_user.isSuperAdmin:
                return {"success": False, "error": "Only super admins can add admin roles"}
            
            # Find target user
            result = await db.execute(select(User).where(User.email == user_email))
            target_user = result.scalar_one_or_none()
            
            if not target_user:
                return {"success": False, "error": "User not found"}
            
            # Update roles
            target_user.isAdmin = make_admin
            target_user.isSuperAdmin = make_super_admin
            await db.commit()
            await db.refresh(target_user)
            
            # Update Firebase custom claims - try but don't fail if it doesn't work
            firebase_success = True
            claims = {}
            if make_admin:
                claims["admin"] = True
            else:
                # Remove admin claim if making user regular
                firebase_success = remove_custom_user_claims(target_user.firebase_uid, ["admin"]) and firebase_success
                
            if make_super_admin:
                claims["superAdmin"] = True
                claims["admin"] = True  # Super admin is also admin
            else:
                # Remove super admin claim if not making super admin
                firebase_success = remove_custom_user_claims(target_user.firebase_uid, ["superAdmin"]) and firebase_success
            
            # Only set claims if there are any to set
            if claims:
                firebase_success = set_custom_user_claims(target_user.firebase_uid, claims) and firebase_success
            
            role_text = []
            if make_super_admin:
                role_text.append("super admin")
            elif make_admin:
                role_text.append("admin")
            
            response_message = f"User {user_email} has been made {' and '.join(role_text) if role_text else 'regular user'}"
            if not firebase_success:
                response_message += " (Note: Firebase custom claims could not be updated - user may need to re-authenticate)"
            
            return {
                "success": True,
                "message": response_message,
                "user": {
                    "id": target_user.id,
                    "email": target_user.email,
                    "full_name": target_user.full_name,
                    "isAdmin": target_user.isAdmin,
                    "isSuperAdmin": target_user.isSuperAdmin
                }
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to update user role: {str(e)}"}

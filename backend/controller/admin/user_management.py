from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, update, case
from db.scheme import User, Resume, PaymentHistory
from config.firebase import set_custom_user_claims, remove_custom_user_claims
from fastapi import HTTPException

class UserManagementController:
    
    @staticmethod
    async def get_users_info(db: AsyncSession) -> Dict[str, Any]:
        """Get comprehensive user statistics and user list"""
        
        # Get total counts
        total_users_result = await db.execute(select(func.count(User.id)))
        total_users = total_users_result.scalar()
        
        active_users_result = await db.execute(
            select(func.count(User.id)).where(User.status == "active")
        )
        active_users = active_users_result.scalar()
        
        premium_users_result = await db.execute(
            select(func.count(User.id)).where(User.is_premium == True)
        )
        premium_users = premium_users_result.scalar()
        
        total_resumes_result = await db.execute(select(func.count(Resume.id)))
        total_resumes = total_resumes_result.scalar()
        
        total_spent_subquery = select(
            PaymentHistory.user_id,
            func.sum(PaymentHistory.amount).label('user_total_spent')
        ).where(
            PaymentHistory.status == 'captured'
        ).group_by(PaymentHistory.user_id).subquery()
        
        users_query = select(
            User.id,
            User.full_name,
            User.email,
            User.phone,
            User.image_url,
            User.status,
            User.is_premium,
            func.count(Resume.id).label('total_resumes'),
            func.coalesce(total_spent_subquery.c.user_total_spent, 0).label('total_spent')
        ).outerjoin(Resume).outerjoin(
            total_spent_subquery, 
            total_spent_subquery.c.user_id == User.id
        ).group_by(User.id, total_spent_subquery.c.user_total_spent)
        
        users_result = await db.execute(users_query)
        users_data = []
        
        for row in users_result:
            users_data.append({
                "id": row.id,
                "username": row.full_name,
                "email": row.email,
                "phone": row.phone,
                "image_url": row.image_url,
                "status": row.status,
                "is_premium": row.is_premium,
                "total_resumes": row.total_resumes,
                "total_spent": row.total_spent / 100 if row.total_spent else 0 
            })
        
        return {
            "stats": {
                "total_users": total_users,
                "active_users": active_users,
                "premium_users": premium_users,
                "total_resumes": total_resumes
            },
            "users": users_data
        }
    
    @staticmethod
    async def get_admin_users(db: AsyncSession, current_user_id: int) -> List[Dict[str, Any]]:
        """Get all admin users excluding current user"""
        
        admin_users_query = select(User).where(
            (User.isAdmin == True) | (User.isSuperAdmin == True),
            User.id != current_user_id
        )
        
        result = await db.execute(admin_users_query)
        admin_users = result.scalars().all()
        
        return [
            {
                "id": user.id,
                "name": user.full_name,
                "email": user.email,
                "phone": user.phone,
                "image_url": user.image_url,
                "is_admin": user.isAdmin,
                "is_super_admin": user.isSuperAdmin
            }
            for user in admin_users
        ]
    
    @staticmethod
    async def delete_user(db: AsyncSession, user_id: int) -> Dict[str, str]:
        """Delete a user and all related data"""
        
        # Check if user exists
        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Remove Firebase custom claims if user has Firebase UID
        if user.firebase_uid:
            remove_custom_user_claims(user.firebase_uid)
        
        # Delete user (cascade will handle related data)
        await db.execute(delete(User).where(User.id == user_id))
        await db.commit()
        
        return {"message": f"User {user.full_name} deleted successfully"}
    
    @staticmethod
    async def update_admin_role(
        db: AsyncSession, 
        user_id: int, 
        is_admin: bool, 
        is_super_admin: bool,
        current_user: User
    ) -> Dict[str, str]:
        """Update admin role for a user (only super admin can do this)"""
        
        if not current_user.isSuperAdmin:
            raise HTTPException(
                status_code=403, 
                detail="Only super admin can modify admin roles"
            )
        
        # Check if target user exists
        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update user roles
        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(isAdmin=is_admin, isSuperAdmin=is_super_admin)
        )
        await db.commit()
        
        # Update Firebase custom claims
        if user.firebase_uid:
            claims = {
                "isAdmin": is_admin,
                "isSuperAdmin": is_super_admin,
                "dbUser": "true"
            }
            set_custom_user_claims(user.firebase_uid, claims)
        
        role_text = "super admin" if is_super_admin else "admin" if is_admin else "regular user"
        return {"message": f"User {user.full_name} role updated to {role_text}"}

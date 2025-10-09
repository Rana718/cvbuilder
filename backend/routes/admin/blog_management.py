from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, desc
from db.db import get_db
from db.scheme import Blog, User
from models.blog_models import BlogCreate, BlogUpdate, BlogResponse
from middleware.admin_auth import require_admin
from middleware.rediscache import redis_cache
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
blogRouter = APIRouter()

@blogRouter.get("/", response_model=list[BlogResponse])
async def get_all_blogs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all blogs for admin"""
    try:
        result = await db.execute(
            select(Blog).order_by(desc(Blog.created_at))
        )
        return result.scalars().all()
    except Exception as e:
        logger.error(f"Error getting all blogs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get blogs")

@blogRouter.post("/", response_model=BlogResponse)
async def create_blog(
    blog_data: BlogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create new blog"""
    try:
        blog = Blog(
            **blog_data.dict(),
            author_id=current_user.id,
            published_at=datetime.utcnow() if blog_data.is_published else None
        )
        
        db.add(blog)
        await db.commit()
        await db.refresh(blog)
        
        # Clear cache
        await redis_cache.purge_pattern("blog")
        
        return blog
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating blog: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create blog")

@blogRouter.put("/{blog_id}", response_model=BlogResponse)
async def update_blog(
    blog_id: int,
    blog_data: BlogUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update blog"""
    try:
        result = await db.execute(select(Blog).where(Blog.id == blog_id))
        blog = result.scalar_one_or_none()
        
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        update_data = blog_data.dict(exclude_unset=True)
        
        # Set published_at if publishing for first time
        if update_data.get('is_published') and not blog.published_at:
            update_data['published_at'] = datetime.utcnow()
        
        if update_data:
            for key, value in update_data.items():
                setattr(blog, key, value)
            
            await db.commit()
            await db.refresh(blog)
        
        # Clear cache
        await redis_cache.purge_pattern("blog")
        
        return blog
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating blog {blog_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update blog")

@blogRouter.delete("/{blog_id}")
async def delete_blog(
    blog_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete blog"""
    try:
        result = await db.execute(select(Blog).where(Blog.id == blog_id))
        blog = result.scalar_one_or_none()
        
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        await db.execute(delete(Blog).where(Blog.id == blog_id))
        await db.commit()
        
        # Clear cache
        await redis_cache.purge_pattern("blog")
        
        return {"message": "Blog deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Error deleting blog {blog_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete blog")

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, desc
from db.scheme import Blog
from models.blog_models import BlogCreate, BlogUpdate
from config.redis import redis_client
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

BLOG_CACHE_KEY = "blogs:published"
BLOG_DETAIL_CACHE_KEY = "blog:detail:"

class BlogAdminController:
    
    @staticmethod
    async def get_all_blogs(db: AsyncSession):
        """Get all blogs for admin"""
        result = await db.execute(
            select(Blog).order_by(desc(Blog.created_at))
        )
        return result.scalars().all()
    
    @staticmethod
    async def create_blog(db: AsyncSession, blog_data: BlogCreate, author_id: int):
        """Create new blog"""
        blog = Blog(
            **blog_data.dict(),
            author_id=author_id,
            published_at=datetime.utcnow() if blog_data.is_published else None
        )
        
        db.add(blog)
        await db.commit()
        await db.refresh(blog)
        
        # Clear cache
        BlogAdminController.clear_blog_cache()
        
        return blog
    
    @staticmethod
    async def update_blog(db: AsyncSession, blog_id: int, blog_data: BlogUpdate):
        """Update blog"""
        result = await db.execute(select(Blog).where(Blog.id == blog_id))
        blog = result.scalar_one_or_none()
        
        if not blog:
            return None
        
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
        BlogAdminController.clear_blog_cache()
        
        return blog
    
    @staticmethod
    async def delete_blog(db: AsyncSession, blog_id: int):
        """Delete blog"""
        result = await db.execute(select(Blog).where(Blog.id == blog_id))
        blog = result.scalar_one_or_none()
        
        if not blog:
            return False
        
        await db.execute(delete(Blog).where(Blog.id == blog_id))
        await db.commit()
        
        # Clear cache
        BlogAdminController.clear_blog_cache()
        
        return True
    
    @staticmethod
    def clear_blog_cache():
        """Clear all blog-related cache"""
        # Get all keys matching blog patterns
        keys = redis_client.keys(f"{BLOG_CACHE_KEY}*")
        keys.extend(redis_client.keys(f"{BLOG_DETAIL_CACHE_KEY}*"))
        
        if keys:
            redis_client.delete(*keys)

from fastapi import APIRouter, HTTPException, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func, update
from db.db import get_db
from db.scheme import Blog
from middleware.rediscache import redis_cache
from db.scheme import User
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/blogs")
@redis_cache.cache_get(expire_minutes=1440)  # 24 hours cache
async def get_blogs(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    category: str = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Get published blogs (cached for 24 hours)"""
    try:
        # Build query
        query = select(Blog).where(Blog.is_published == True)
        if category:
            query = query.where(Blog.category == category)
        
        # Get total count
        count_query = select(func.count(Blog.id)).where(Blog.is_published == True)
        if category:
            count_query = count_query.where(Blog.category == category)
        
        total_result = await db.execute(count_query)
        total = total_result.scalar()
        
        # Get blogs
        offset = (page - 1) * limit
        query = query.order_by(desc(Blog.published_at)).offset(offset).limit(limit)
        result = await db.execute(query)
        blogs = result.scalars().all()
        
        # Format response
        blogs_data = [
            {
                "id": blog.id,
                "title": blog.title,
                "slug": blog.slug,
                "excerpt": blog.excerpt,
                "featured_image": blog.featured_image,
                "category": blog.category,
                "tags": blog.tags,
                "is_featured": blog.is_featured,
                "views_count": blog.views_count,
                "reading_time": blog.reading_time,
                "created_at": blog.created_at.isoformat(),
                "published_at": blog.published_at.isoformat() if blog.published_at else None
            }
            for blog in blogs
        ]
        
        return {
            "blogs": blogs_data,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting blogs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get blogs")

@router.get("/blogs/{slug}")
@redis_cache.cache_get(expire_minutes=1440)  # 24 hours cache
async def get_blog(
    request: Request,
    slug: str, 
    db: AsyncSession = Depends(get_db)
):
    """Get single blog by slug (cached for 24 hours)"""
    try:
        result = await db.execute(
            select(Blog).where(Blog.slug == slug, Blog.is_published == True)
        )
        blog = result.scalar_one_or_none()
        
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        await db.execute(
            update(Blog)
            .where(Blog.id == blog.id)
            .values(views_count=Blog.views_count + 1)
        )
        await db.commit()
        
        return {
            "id": blog.id,
            "title": blog.title,
            "slug": blog.slug,
            "excerpt": blog.excerpt,
            "content": blog.content,
            "featured_image": blog.featured_image,
            "meta_title": blog.meta_title,
            "meta_description": blog.meta_description,
            "keywords": blog.keywords,
            "category": blog.category,
            "tags": blog.tags,
            "is_featured": blog.is_featured,
            "views_count": blog.views_count + 1,
            "reading_time": blog.reading_time,
            "created_at": blog.created_at.isoformat(),
            "published_at": blog.published_at.isoformat() if blog.published_at else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting blog {slug}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get blog")

@router.get("/blogs/category/{category}")
@redis_cache.cache_get(expire_minutes=1440)  # 24 hours cache
async def get_blogs_by_category(
    category: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Get blogs by category (cached for 24 hours)"""
    try:
        query = select(Blog).where(Blog.is_published == True, Blog.category == category)
        
        count_query = select(func.count(Blog.id)).where(Blog.is_published == True, Blog.category == category)
        total_result = await db.execute(count_query)
        total = total_result.scalar()
        
        offset = (page - 1) * limit
        query = query.order_by(desc(Blog.published_at)).offset(offset).limit(limit)
        result = await db.execute(query)
        blogs = result.scalars().all()
        
        blogs_data = [
            {
                "id": blog.id,
                "title": blog.title,
                "slug": blog.slug,
                "excerpt": blog.excerpt,
                "featured_image": blog.featured_image,
                "category": blog.category,
                "tags": blog.tags,
                "is_featured": blog.is_featured,
                "views_count": blog.views_count,
                "reading_time": blog.reading_time,
                "created_at": blog.created_at.isoformat(),
                "published_at": blog.published_at.isoformat() if blog.published_at else None
            }
            for blog in blogs
        ]
        
        return {
            "blogs": blogs_data,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting blogs by category {category}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get blogs")

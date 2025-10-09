from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BlogBase(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: str
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[List[str]] = []
    category: Optional[str] = None
    tags: Optional[List[str]] = []
    is_published: bool = False
    is_featured: bool = False
    reading_time: int = 5

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[List[str]] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    reading_time: Optional[int] = None

class BlogResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    content: str
    featured_image: Optional[str]
    meta_title: Optional[str]
    meta_description: Optional[str]
    keywords: Optional[List[str]]
    author_id: int
    category: Optional[str]
    tags: Optional[List[str]]
    is_published: bool
    is_featured: bool
    views_count: int
    reading_time: int
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]

    class Config:
        from_attributes = True

class BlogListResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    featured_image: Optional[str]
    category: Optional[str]
    tags: Optional[List[str]]
    is_published: bool
    is_featured: bool
    views_count: int
    reading_time: int
    created_at: datetime
    published_at: Optional[datetime]

    class Config:
        from_attributes = True

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Authentication
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    google_id = Column(String(255), nullable=True)
    github_id = Column(String(255), nullable=True)

    # Account Info
    is_premium = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"

class Resume(Base):
    __tablename__ = "resumes"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Personal Information
    name = Column(String(200), nullable=False)
    phone = Column(String(20))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))

    # Resume Details
    job_title = Column(String(200))
    summary = Column(Text)
    skills = Column(JSON)
    experience = Column(JSON)
    education = Column(JSON)
    certifications = Column(JSON)
    projects = Column(JSON)
    languages = Column(JSON)

    # Social Links
    linkedin_url = Column(String(500))
    github_url = Column(String(500))
    portfolio_url = Column(String(500))

    # CV Settings
    template_id = Column(Integer, nullable=False)
    theme_color = Column(String(20), default="blue")

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship back to User
    user = relationship("User", back_populates="resumes")

    def __repr__(self):
        return f"<Resume(id={self.id}, user_id={self.user_id}, job_title='{self.job_title}')>"

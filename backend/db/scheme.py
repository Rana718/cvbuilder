from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)

    # Authentication
    email = Column(String(255), unique=True, index=True, nullable=False)
    google_id = Column(String(255))
    firebase_uid = Column(String(255), unique=True, index=True)  
    image_url = Column(String(500))
    is_premium = Column(Boolean, default=False)
    
    # Profile Info
    full_name = Column(String(255), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    cover_letters = relationship("CoverLetter", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("Subscription", uselist=False, back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.full_name}')>"

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    shareable_uuid = Column(String(36), unique=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Personal Information
    name = Column(String(200), nullable=False)
    email = Column(String(255))
    image_url = Column(String(500))
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

    user = relationship("User", back_populates="resumes")

    def __repr__(self):
        return f"<Resume(id={self.id}, user_id={self.user_id}, job_title='{self.job_title}')>"


class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    shareable_uuid = Column(String(36), unique=True, index=True)

    template_id = Column(Integer, nullable=False)

    name = Column(String(200), nullable=False)
    email = Column(String(255))
    phone = Column(String(20))
    address = Column(String(500))
    recipient_title = Column(String(200))
    recipient_company = Column(String(200))
    body = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="cover_letters")
    resume = relationship("Resume")

    def __repr__(self):
        return f"<CoverLetter(id={self.id}, user_id={self.user_id}, name='{self.name}')>"
    

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    razorpay_customer_id = Column(String(255), nullable=False)
    subscription_id = Column(String(255), nullable=False)
    plan = Column(String(100), default="free", nullable=False) 
    status = Column(String(50), nullable=False)
    current_period_end = Column(DateTime(timezone=True))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")

    def __repr__(self):
        return f"<Subscription(id={self.id}, user_id={self.user_id}, plan='{self.plan}', status='{self.status}')>"
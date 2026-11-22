from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from datetime import datetime, timezone
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

class Profile(Base):
    __tablename__ = "profile"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False, default="Developer")
    title = Column(String(150), nullable=False, default="Full-Stack Engineer & System Architect")
    bio = Column(Text, nullable=True)
    about_markdown = Column(Text, nullable=True)
    university = Column(String(150), nullable=True)
    degree = Column(String(150), nullable=True)
    graduation_year = Column(String(50), nullable=True)
    gpa = Column(String(50), nullable=True)
    location = Column(String(100), nullable=True, default="Earth")
    email = Column(String(100), nullable=True)
    github = Column(String(200), nullable=True)
    linkedin = Column(String(200), nullable=True)
    twitter = Column(String(200), nullable=True)
    website = Column(String(200), nullable=True)
    leetcode = Column(String(200), nullable=True)
    codechef = Column(String(200), nullable=True)
    codeforces = Column(String(200), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    resume_url = Column(String(500), nullable=True)
    open_to_work = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, index=True, nullable=False)
    summary = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, default="Full-Stack")
    tags = Column(String(300), nullable=False, default="")  # comma separated
    featured_image = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False)
    status = Column(String(20), default="published", index=True)  # published, draft, archived
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False, default="Frontend")  # Frontend, Backend, Cloud & DevOps, Database, Tools
    tier = Column(String(50), default="Core", nullable=True)  # Core, Proficient, Exploring
    proficiency = Column(Integer, default=90)  # 0 to 100
    icon = Column(String(100), nullable=True)  # Lucide icon name or image url
    is_highlighted = Column(Boolean, default=False)
    status = Column(String(20), default="published", index=True)  # published, draft, archived
    order_index = Column(Integer, default=0)

class Experience(Base):
    __tablename__ = "experience"
    
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(150), nullable=False)
    company = Column(String(150), nullable=False)
    company_url = Column(String(300), nullable=True)
    location = Column(String(100), nullable=True)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=True)  # e.g., "Present" or "Dec 2025"
    is_current = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    bullet_points = Column(Text, nullable=True)  # newline separated
    status = Column(String(20), default="published", index=True)  # published, draft, archived
    order_index = Column(Integer, default=0)

class Certification(Base):
    __tablename__ = "certifications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    issuer = Column(String(150), nullable=False)
    issue_date = Column(String(50), nullable=False)
    expiry_date = Column(String(50), nullable=True)
    credential_id = Column(String(150), nullable=True)
    credential_url = Column(String(500), nullable=True)
    certificate_image = Column(String(500), nullable=True)
    category = Column(String(100), default="Professional Learning & Certifications", index=True)
    description = Column(Text, nullable=True)
    duration = Column(String(100), nullable=True)
    skills = Column(String(300), nullable=True)
    status = Column(String(20), default="published", index=True)  # published, draft, archived
    order_index = Column(Integer, default=0)

class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String(200), nullable=False)
    institution = Column(String(250), nullable=False)
    period = Column(String(50), nullable=False)  # e.g., "2024 — 2028"
    metrics = Column(String(100), nullable=True)  # e.g., "CGPA: 8.7/10" or "88.5%"
    tags = Column(String(300), nullable=False, default="")  # comma separated, e.g., "AI & ML"
    icon = Column(String(50), default="degree")  # "degree" or "school"
    status = Column(String(20), default="published", index=True)  # published, draft, archived
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)

class Milestone(Base):
    __tablename__ = "milestones"
    
    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, nullable=False, index=True)
    pct = Column(Float, nullable=False, default=0.0)
    title = Column(String(200), nullable=False)
    subtitle = Column(Text, nullable=False)
    period = Column(String(100), nullable=False)
    status = Column(String(50), default="Completed")  # Completed, In Progress, Upcoming
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    subject = Column(String(200), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)


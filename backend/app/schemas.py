from pydantic import BaseModel, Field, ConfigDict, field_validator
import re
from typing import Optional, List
from datetime import datetime

# --- Token & Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: datetime

# --- Profile Schemas ---
class ProfileBase(BaseModel):
    full_name: str
    title: str
    bio: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None
    resume_url: Optional[str] = None
    open_to_work: bool = True
    about_markdown: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[str] = None
    gpa: Optional[str] = None
    leetcode: Optional[str] = None
    codechef: Optional[str] = None
    codeforces: Optional[str] = None

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None
    resume_url: Optional[str] = None
    open_to_work: Optional[bool] = None
    about_markdown: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[str] = None
    gpa: Optional[str] = None
    leetcode: Optional[str] = None
    codechef: Optional[str] = None
    codeforces: Optional[str] = None

class ProfileOut(ProfileBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    updated_at: Optional[datetime] = None

# --- Project Schemas ---
class ProjectBase(BaseModel):
    title: str
    slug: str
    summary: str
    description: Optional[str] = None
    category: str = "Full-Stack"
    tags: str = ""
    featured_image: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    video_url: Optional[str] = None
    is_featured: bool = False
    status: str = "published"  # published, draft, archived
    order_index: int = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    featured_image: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    video_url: Optional[str] = None
    is_featured: Optional[bool] = None
    status: Optional[str] = None
    order_index: Optional[int] = None

class ProjectOut(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime

# --- Skill Schemas ---
class SkillBase(BaseModel):
    name: str
    category: str = "Frontend"
    tier: Optional[str] = "Core"  # Core, Proficient, Exploring
    proficiency: int = Field(default=85, ge=0, le=100)
    icon: Optional[str] = None
    is_highlighted: bool = False
    status: str = "published"
    order_index: int = 0

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    tier: Optional[str] = None
    proficiency: Optional[int] = None
    icon: Optional[str] = None
    is_highlighted: Optional[bool] = None
    status: Optional[str] = None
    order_index: Optional[int] = None

class SkillOut(SkillBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

# --- Experience Schemas ---
class ExperienceBase(BaseModel):
    role: str
    company: str
    company_url: Optional[str] = None
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    bullet_points: Optional[str] = None
    status: str = "published"
    order_index: int = 0

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    company_url: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    bullet_points: Optional[str] = None
    status: Optional[str] = None
    order_index: Optional[int] = None

class ExperienceOut(ExperienceBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

# --- Certification Schemas ---
class CertificationBase(BaseModel):
    title: str
    issuer: str
    issue_date: str
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    certificate_image: Optional[str] = None
    category: Optional[str] = "Professional Learning & Certifications"
    description: Optional[str] = None
    duration: Optional[str] = None
    skills: Optional[str] = None
    status: str = "published"
    order_index: int = 0

class CertificationCreate(CertificationBase):
    pass

class CertificationUpdate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    certificate_image: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    skills: Optional[str] = None
    status: Optional[str] = None
    order_index: Optional[int] = None

class CertificationOut(CertificationBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

# --- Education Schemas ---
class EducationBase(BaseModel):
    degree: str
    institution: str
    period: str
    metrics: Optional[str] = None
    tags: str = ""
    icon: str = "degree"  # "degree" or "school"
    status: str = "published"
    order_index: int = 0

class EducationCreate(EducationBase):
    pass

class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    period: Optional[str] = None
    metrics: Optional[str] = None
    tags: Optional[str] = None
    icon: Optional[str] = None
    status: Optional[str] = None
    order_index: Optional[int] = None

class EducationOut(EducationBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

# --- Milestone Schemas ---
class MilestoneBase(BaseModel):
    year: int
    pct: float = 0.0
    title: str
    subtitle: str
    period: str
    status: str = "Completed"  # Completed, In Progress, Upcoming
    order_index: int = 0

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneUpdate(BaseModel):
    year: Optional[int] = None
    pct: Optional[float] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    period: Optional[str] = None
    status: Optional[str] = None
    order_index: Optional[int] = None

class MilestoneOut(MilestoneBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

# --- Message Schemas ---
class MessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    subject: Optional[str] = Field(None, max_length=200)
    message: str = Field(..., min_length=5, max_length=5000)

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Invalid email format")
        return v.strip().lower()

class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    is_read: bool
    created_at: datetime

# --- Dashboard Stats ---
class DashboardStats(BaseModel):
    total_projects: int
    published_projects: int
    draft_projects: int
    archived_projects: int
    total_skills: int
    total_experience: int
    total_certifications: int
    unread_messages: int
    total_messages: int

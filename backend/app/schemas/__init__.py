from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict


# ===================== User & Auth =====================
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role: Optional[str] = "member"


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    role: str
    is_active: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ===================== Product =====================
class ProductBase(BaseModel):
    name: str
    subtitle: str = ""
    description: str = ""
    target_group: str = ""
    tags: List[str] = []
    image_url: str = ""
    order_index: int = 0
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    name: Optional[str] = None


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    detail: Optional["ProductDetailResponse"] = None


# ===================== ProductDetail =====================
class ProductDetailBase(BaseModel):
    efficacy: dict = {}
    core_meal_replacement: dict = {}
    synergistic_nutrients: dict = {}


class ProductDetailCreate(ProductDetailBase):
    pass


class ProductDetailUpdate(BaseModel):
    efficacy: Optional[dict] = None
    core_meal_replacement: Optional[dict] = None
    synergistic_nutrients: Optional[dict] = None


class ProductDetailResponse(ProductDetailBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_id: int
    created_at: datetime
    updated_at: datetime


# ===================== Article =====================
class ArticleBase(BaseModel):
    title: str
    category: str = "knowledge"
    summary: str = ""
    content: str = ""
    published_at: Optional[datetime] = None
    is_active: bool = True


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(ArticleBase):
    title: Optional[str] = None


class ArticleResponse(ArticleBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ===================== Comment =====================
class CommentBase(BaseModel):
    product_id: Optional[int] = None
    user_name: str = ""
    avatar_url: str = ""
    content: str = ""
    rating: int = 5
    metrics: dict = {}


class CommentCreate(CommentBase):
    pass


class CommentResponse(CommentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ===================== MemberProfile =====================
class MemberProfileBase(BaseModel):
    gender: str = ""
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    health_goals: List[str] = []
    lifestyle_tags: List[str] = []
    allergies: str = ""
    medical_history: str = ""


class MemberProfileCreate(MemberProfileBase):
    pass


class MemberProfileResponse(MemberProfileBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    updated_at: datetime


# ===================== HealthSubmission =====================
class HealthSubmissionBase(BaseModel):
    answers: dict = {}
    file_url: str = ""


class HealthSubmissionCreate(HealthSubmissionBase):
    pass


class HealthSubmissionResponse(HealthSubmissionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    status: str
    recommendations: List[dict] = []
    summary: str = ""
    created_at: datetime


# ===================== Subscription =====================
class SubscriptionBase(BaseModel):
    plan_type: str = "monthly"
    status: str = "active"
    expired_at: Optional[datetime] = None


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionResponse(SubscriptionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    started_at: datetime


# ===================== Dashboard =====================
class DashboardStats(BaseModel):
    total_visitors: int
    total_members: int
    paid_members: int
    conversion_rate: float
    revenue: float

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.api.deps import require_admin
from app import models, schemas

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=schemas.DashboardStats)
def dashboard(db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    total_members = db.query(models.User).filter(models.User.role == "member").count()
    paid_members = db.query(models.Subscription).filter(models.Subscription.status == "active").count()
    total_visitors = total_members * 8  # placeholder for real analytics
    conversion_rate = round(paid_members / total_visitors * 100, 2) if total_visitors else 0.0
    revenue = paid_members * 299.0  # placeholder avg price
    return schemas.DashboardStats(
        total_visitors=total_visitors,
        total_members=total_members,
        paid_members=paid_members,
        conversion_rate=conversion_rate,
        revenue=revenue,
    )

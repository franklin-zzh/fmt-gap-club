from typing import List
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import require_member, require_admin
from app import models, schemas

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

PLAN_DAYS = {"monthly": 30, "quarterly": 90, "yearly": 365}


@router.get("/me", response_model=schemas.SubscriptionResponse)
def get_subscription(current_user: models.User = Depends(require_member), db: Session = Depends(get_db)):
    sub = db.query(models.Subscription).filter(models.Subscription.user_id == current_user.id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="No subscription found")
    return sub


@router.post("/me/renew", response_model=schemas.SubscriptionResponse)
def renew_subscription(
    payload: schemas.SubscriptionCreate,
    current_user: models.User = Depends(require_member),
    db: Session = Depends(get_db),
):
    sub = db.query(models.Subscription).filter(models.Subscription.user_id == current_user.id).first()
    days = PLAN_DAYS.get(payload.plan_type, 30)
    now = datetime.utcnow()
    if not sub:
        sub = models.Subscription(
            user_id=current_user.id,
            plan_type=payload.plan_type,
            status="active",
            started_at=now,
            expired_at=now + timedelta(days=days),
        )
        db.add(sub)
    else:
        sub.plan_type = payload.plan_type
        sub.status = "active"
        base = sub.expired_at if sub.expired_at and sub.expired_at > now else now
        sub.expired_at = base + timedelta(days=days)
    db.commit()
    db.refresh(sub)
    return sub


@router.get("", response_model=List[schemas.SubscriptionResponse])
def list_subscriptions(db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    return db.query(models.Subscription).order_by(models.Subscription.started_at.desc()).all()

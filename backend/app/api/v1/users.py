from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import require_admin
from app import models, schemas

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=List[schemas.UserResponse])
def list_users(
    q: str = Query(None),
    role: str = Query(None),
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    query = db.query(models.User)
    if q:
        query = query.filter(models.User.email.ilike(f"%{q}%"))
    if role:
        query = query.filter(models.User.role == role)
    return query.order_by(models.User.created_at.desc()).all()


@router.patch("/{user_id}/status", response_model=schemas.UserResponse)
def toggle_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return user

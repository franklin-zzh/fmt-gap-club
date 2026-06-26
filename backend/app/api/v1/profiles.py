from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import require_member
from app import models, schemas

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/me", response_model=schemas.MemberProfileResponse)
def get_profile(current_user: models.User = Depends(require_member), db: Session = Depends(get_db)):
    profile = db.query(models.MemberProfile).filter(models.MemberProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.MemberProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.put("/me", response_model=schemas.MemberProfileResponse)
def update_profile(
    payload: schemas.MemberProfileCreate,
    current_user: models.User = Depends(require_member),
    db: Session = Depends(get_db),
):
    profile = db.query(models.MemberProfile).filter(models.MemberProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.MemberProfile(user_id=current_user.id, **payload.model_dump())
        db.add(profile)
    else:
        for key, value in payload.model_dump().items():
            setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile

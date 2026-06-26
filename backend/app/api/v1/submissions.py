from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import json
import os
import shutil
from app.core.config import get_settings
from app.db.session import get_db
from app.api.deps import require_member
from app.services.ai_matching import match_products
from app import models, schemas

router = APIRouter(prefix="/submissions", tags=["submissions"])
settings = get_settings()


@router.get("", response_model=List[schemas.HealthSubmissionResponse])
def list_submissions(
    current_user: models.User = Depends(require_member),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.HealthSubmission)
        .filter(models.HealthSubmission.user_id == current_user.id)
        .order_by(models.HealthSubmission.created_at.desc())
        .all()
    )


@router.post("", response_model=schemas.HealthSubmissionResponse)
def create_submission(
    answers: str = Form("{}"),
    file: UploadFile = File(None),
    current_user: models.User = Depends(require_member),
    db: Session = Depends(get_db),
):
    answers_dict = json.loads(answers)
    file_url = ""
    if file and file.filename:
        upload_dir = settings.UPLOAD_DIR
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, f"{current_user.id}_{file.filename}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_url = f"/static/uploads/{current_user.id}_{file.filename}"

    # Build recommendations based on profile + answers
    profile = db.query(models.MemberProfile).filter(models.MemberProfile.user_id == current_user.id).first()
    recommendations, summary = match_products(profile, answers_dict, db)

    submission = models.HealthSubmission(
        user_id=current_user.id,
        answers=answers_dict,
        file_url=file_url,
        status="completed",
        recommendations=recommendations,
        summary=summary,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/{submission_id}", response_model=schemas.HealthSubmissionResponse)
def get_submission(
    submission_id: int,
    current_user: models.User = Depends(require_member),
    db: Session = Depends(get_db),
):
    submission = db.query(models.HealthSubmission).filter(
        models.HealthSubmission.id == submission_id,
        models.HealthSubmission.user_id == current_user.id,
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

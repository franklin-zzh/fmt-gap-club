from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import require_admin
from app import models, schemas

router = APIRouter(prefix="/comments", tags=["comments"])


@router.get("", response_model=List[schemas.CommentResponse])
def list_comments(product_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Comment)
    if product_id:
        query = query.filter(models.Comment.product_id == product_id)
    return query.order_by(models.Comment.created_at.desc()).all()


@router.post("", response_model=schemas.CommentResponse)
def create_comment(
    payload: schemas.CommentCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    comment = models.Comment(**payload.model_dump())
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import require_admin
from app import models, schemas

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("", response_model=List[schemas.ArticleResponse])
def list_articles(category: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Article).filter(models.Article.is_active == True)
    if category:
        query = query.filter(models.Article.category == category)
    return query.order_by(models.Article.created_at.desc()).all()


@router.get("/{article_id}", response_model=schemas.ArticleResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("", response_model=schemas.ArticleResponse)
def create_article(
    payload: schemas.ArticleCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    article = models.Article(**payload.model_dump())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


@router.put("/{article_id}", response_model=schemas.ArticleResponse)
def update_article(
    article_id: int,
    payload: schemas.ArticleUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(article, key, value)
    db.commit()
    db.refresh(article)
    return article


@router.delete("/{article_id}")
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    article.is_active = False
    db.commit()
    return {"detail": "Article deleted"}

import os
import shutil
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.db.session import get_db
from app.api.deps import get_current_active_user, require_admin
from app import models, schemas

router = APIRouter(prefix="/products", tags=["products"])
settings = get_settings()


@router.get("", response_model=List[schemas.ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.is_active == True).order_by(models.Product.order_index).all()


@router.get("/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=schemas.ProductResponse)
def create_product(
    payload: schemas.ProductCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    product = models.Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: int,
    payload: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.post("/upload-image")
def upload_product_image(
    file: UploadFile = File(...),
    admin: models.User = Depends(require_admin),
):
    """Upload a product image and return its URL path."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/gif", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Allowed: JPEG, PNG, GIF, WebP")

    # Generate unique filename to avoid conflicts
    ext = os.path.splitext(file.filename)[1] or ".png"
    unique_name = f"product_{uuid.uuid4().hex[:12]}{ext}"

    upload_dir = settings.UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, unique_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"url": f"/static/uploads/{unique_name}"}


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False
    db.commit()
    return {"detail": "Product deleted"}

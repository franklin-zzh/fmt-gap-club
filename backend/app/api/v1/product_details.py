from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import require_admin
from app import models, schemas

router = APIRouter(prefix="/products", tags=["product-details"])


@router.get("/{product_id}/detail", response_model=schemas.ProductDetailResponse)
def get_product_detail(
    product_id: int,
    db: Session = Depends(get_db),
):
    """获取指定产品的详情"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    detail = db.query(models.ProductDetail).filter(
        models.ProductDetail.product_id == product_id
    ).first()
    if not detail:
        raise HTTPException(status_code=404, detail="Product detail not found")
    return detail


@router.post("/{product_id}/detail", response_model=schemas.ProductDetailResponse, status_code=201)
def create_product_detail(
    product_id: int,
    payload: schemas.ProductDetailCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    """创建产品详情（admin 权限）"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 检查是否已存在详情（1对1约束）
    existing = db.query(models.ProductDetail).filter(
        models.ProductDetail.product_id == product_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Product detail already exists, use PUT to update",
        )

    detail = models.ProductDetail(
        product_id=product_id,
        **payload.model_dump(),
    )
    db.add(detail)
    db.commit()
    db.refresh(detail)
    return detail


@router.put("/{product_id}/detail", response_model=schemas.ProductDetailResponse)
def update_product_detail(
    product_id: int,
    payload: schemas.ProductDetailUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    """更新产品详情（admin 权限）"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    detail = db.query(models.ProductDetail).filter(
        models.ProductDetail.product_id == product_id
    ).first()
    if not detail:
        raise HTTPException(status_code=404, detail="Product detail not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(detail, key, value)
    db.commit()
    db.refresh(detail)
    return detail


@router.delete("/{product_id}/detail")
def delete_product_detail(
    product_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    """删除产品详情（admin 权限）"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    detail = db.query(models.ProductDetail).filter(
        models.ProductDetail.product_id == product_id
    ).first()
    if not detail:
        raise HTTPException(status_code=404, detail="Product detail not found")

    db.delete(detail)
    db.commit()
    return {"detail": "Product detail deleted"}

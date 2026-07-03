import pytest
from fastapi import HTTPException
from jose import jwt

from app.api import deps
from app.core.config import get_settings
from app.core.security import create_access_token
from app import models


def test_get_current_user_success(db, member_user):
    token = create_access_token(subject=member_user.id)
    user = deps.get_current_user(token=token, db=db)
    assert user.id == member_user.id


def test_get_current_user_invalid_token(db):
    with pytest.raises(HTTPException) as exc:
        deps.get_current_user(token="not.a.token", db=db)
    assert exc.value.status_code == 401


def test_get_current_user_missing_sub(db):
    settings = get_settings()
    token = jwt.encode({"exp": 9999999999}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    with pytest.raises(HTTPException) as exc:
        deps.get_current_user(token=token, db=db)
    assert exc.value.status_code == 401


def test_get_current_user_user_not_found(db):
    token = create_access_token(subject=99999)
    with pytest.raises(HTTPException) as exc:
        deps.get_current_user(token=token, db=db)
    assert exc.value.status_code == 401


def test_get_current_active_user_success(member_user):
    user = deps.get_current_active_user(current_user=member_user)
    assert user.id == member_user.id


def test_get_current_active_user_inactive(inactive_user):
    with pytest.raises(HTTPException) as exc:
        deps.get_current_active_user(current_user=inactive_user)
    assert exc.value.status_code == 400


def test_require_admin_success(admin_user):
    user = deps.require_admin(current_user=admin_user)
    assert user.id == admin_user.id


def test_require_admin_forbidden(member_user):
    with pytest.raises(HTTPException) as exc:
        deps.require_admin(current_user=member_user)
    assert exc.value.status_code == 403


def test_require_member_success(member_user):
    user = deps.require_member(current_user=member_user)
    assert user.id == member_user.id


def test_require_member_admin_also_allowed(admin_user):
    user = deps.require_member(current_user=admin_user)
    assert user.id == admin_user.id


def test_require_member_forbidden(db):
    user = models.User(email="guest@fmt.com", hashed_password="x", role="guest")
    db.add(user)
    db.commit()
    db.refresh(user)
    with pytest.raises(HTTPException) as exc:
        deps.require_member(current_user=user)
    assert exc.value.status_code == 403

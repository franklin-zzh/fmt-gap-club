from datetime import timedelta

from app.core.security import create_access_token, decode_token, get_password_hash, verify_password


def test_create_access_token_default_expiry():
    token = create_access_token(subject="user-1")
    payload = decode_token(token)
    assert payload["sub"] == "user-1"
    assert "exp" in payload


def test_create_access_token_custom_expiry():
    token = create_access_token(subject=42, expires_delta=timedelta(minutes=5))
    payload = decode_token(token)
    assert payload["sub"] == "42"


def test_password_hash_and_verify():
    plain = "secret123"
    hashed = get_password_hash(plain)
    assert verify_password(plain, hashed) is True
    assert verify_password("wrong", hashed) is False

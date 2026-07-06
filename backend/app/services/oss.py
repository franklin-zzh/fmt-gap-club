import os
import uuid
from functools import lru_cache
from typing import Optional

from fastapi import UploadFile

from app.core.config import Settings, get_settings

try:
    import oss2
except ImportError:  # pragma: no cover - installed via requirements.txt
    oss2 = None  # type: ignore[assignment]


def _check_oss_available() -> None:
    if oss2 is None:
        raise RuntimeError("oss2 is not installed, please install requirements")


def _oss_settings(settings: Settings) -> dict:
    return {
        "access_key_id": settings.ALIYUN_OSS_ACCESS_KEY_ID,
        "access_key_secret": settings.ALIYUN_OSS_ACCESS_KEY_SECRET,
        "bucket_name": settings.ALIYUN_OSS_BUCKET_NAME,
        "endpoint": settings.ALIYUN_OSS_ENDPOINT,
        "cdn_base_url": settings.ALIYUN_OSS_CDN_BASE_URL,
        "prefix": settings.ALIYUN_OSS_PRODUCTS_PREFIX,
    }


def _validate_oss_settings(settings: Settings) -> None:
    cfg = _oss_settings(settings)
    missing = [k for k, v in cfg.items() if k != "prefix" and not v]
    if missing:
        raise RuntimeError(
            f"OSS configuration incomplete, missing: {', '.join(missing)}"
        )


@lru_cache()
def get_bucket() -> "oss2.Bucket":
    """Return a cached OSS Bucket instance."""
    _check_oss_available()
    settings = get_settings()
    _validate_oss_settings(settings)

    auth = oss2.Auth(
        settings.ALIYUN_OSS_ACCESS_KEY_ID, settings.ALIYUN_OSS_ACCESS_KEY_SECRET
    )
    return oss2.Bucket(
        auth, settings.ALIYUN_OSS_ENDPOINT, settings.ALIYUN_OSS_BUCKET_NAME
    )


def upload_file(
    file: UploadFile,
    prefix: Optional[str] = None,
    settings: Optional[Settings] = None,
) -> str:
    """Upload an UploadFile to Aliyun OSS and return the CDN URL.

    Args:
        file: The uploaded file.
        prefix: Optional object key prefix (defaults to settings.ALIYUN_OSS_PRODUCTS_PREFIX).
        settings: Optional settings instance, useful for tests.
    """
    _check_oss_available()
    if settings is None:
        settings = get_settings()

    _validate_oss_settings(settings)

    if prefix is None:
        prefix = settings.ALIYUN_OSS_PRODUCTS_PREFIX

    ext = os.path.splitext(file.filename or "")[1] or ".png"
    unique_name = f"{uuid.uuid4().hex[:12]}{ext}"
    key = f"{prefix.rstrip('/')}/{unique_name}" if prefix else unique_name

    bucket = get_bucket()
    data = file.file.read()
    bucket.put_object(key, data)

    cdn_base = settings.ALIYUN_OSS_CDN_BASE_URL.rstrip("/")
    return f"{cdn_base}/{key}"

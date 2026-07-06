from io import BytesIO
from unittest.mock import MagicMock

import pytest
from fastapi import UploadFile

from app.core.config import Settings
from app.services import oss as oss_module
from app.services.oss import get_bucket, upload_file


@pytest.fixture(autouse=True)
def clear_bucket_cache():
    """每个测试前清空 OSS bucket 缓存，避免 lru_cache 影响设置变更。"""
    get_bucket.cache_clear()


def _make_file(filename: str, content: bytes, content_type: str = "image/png") -> UploadFile:
    return UploadFile(filename=filename, file=BytesIO(content), headers={"content-type": content_type})


def _valid_settings(**overrides) -> Settings:
    defaults = {
        "ALIYUN_OSS_ACCESS_KEY_ID": "ak",
        "ALIYUN_OSS_ACCESS_KEY_SECRET": "sk",
        "ALIYUN_OSS_BUCKET_NAME": "fmt-gap-club",
        "ALIYUN_OSS_ENDPOINT": "oss-cn-beijing.aliyuncs.com",
        "ALIYUN_OSS_CDN_BASE_URL": "https://assets.gapclub.fmtcloud.cn",
        "ALIYUN_OSS_PRODUCTS_PREFIX": "products",
    }
    defaults.update(overrides)
    return Settings(**defaults)


def test_upload_file_default_prefix(monkeypatch):
    fake_bucket = MagicMock()
    monkeypatch.setattr(oss_module.oss2, "Auth", lambda ak, sk: MagicMock())
    monkeypatch.setattr(oss_module.oss2, "Bucket", lambda auth, endpoint, bucket: fake_bucket)
    monkeypatch.setattr(oss_module, "get_settings", _valid_settings)

    file = _make_file("pic.png", b"image bytes")
    url = upload_file(file)

    assert url.startswith("https://assets.gapclub.fmtcloud.cn/products/")
    assert fake_bucket.put_object.called
    key = fake_bucket.put_object.call_args[0][0]
    assert key.startswith("products/")
    assert key.endswith(".png")


def test_upload_file_custom_prefix(monkeypatch):
    fake_bucket = MagicMock()
    monkeypatch.setattr(oss_module.oss2, "Auth", lambda ak, sk: MagicMock())
    monkeypatch.setattr(oss_module.oss2, "Bucket", lambda auth, endpoint, bucket: fake_bucket)
    monkeypatch.setattr(oss_module, "get_settings", _valid_settings)

    file = _make_file("pic.jpg", b"image bytes")
    url = upload_file(file, prefix="thumbs")

    assert "/thumbs/" in url


def test_upload_file_raises_when_settings_incomplete():
    settings = _valid_settings(ALIYUN_OSS_ACCESS_KEY_ID="")
    file = _make_file("pic.png", b"image bytes")
    with pytest.raises(RuntimeError, match="OSS configuration incomplete"):
        upload_file(file, settings=settings)


def test_get_bucket_raises_when_settings_incomplete(monkeypatch):
    monkeypatch.setattr(oss_module, "get_settings", lambda: _valid_settings(ALIYUN_OSS_ACCESS_KEY_SECRET=""))
    with pytest.raises(RuntimeError, match="OSS configuration incomplete"):
        get_bucket()


def test_upload_file_no_extension_uses_png(monkeypatch):
    fake_bucket = MagicMock()
    monkeypatch.setattr(oss_module.oss2, "Auth", lambda ak, sk: MagicMock())
    monkeypatch.setattr(oss_module.oss2, "Bucket", lambda auth, endpoint, bucket: fake_bucket)
    monkeypatch.setattr(oss_module, "get_settings", _valid_settings)

    file = _make_file("noext", b"image bytes")
    url = upload_file(file)

    assert url.endswith(".png")


def test_upload_file_raises_when_oss2_unavailable(monkeypatch):
    monkeypatch.setattr(oss_module, "oss2", None)
    file = _make_file("pic.png", b"image bytes")
    settings = _valid_settings()
    with pytest.raises(RuntimeError, match="oss2 is not installed"):
        upload_file(file, settings=settings)

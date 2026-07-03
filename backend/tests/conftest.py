import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 在导入 app 模块前设置测试数据库
os.environ["DATABASE_URL"] = "sqlite:///./test_gapclub.db"

from app.main import app  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.session import get_db  # noqa: E402
from app import main as main_module, seed as seed_module  # noqa: E402
from app.core.security import get_password_hash, create_access_token  # noqa: E402
from app import models  # noqa: E402

# 测试数据库引擎
_test_engine = create_engine(
    os.environ["DATABASE_URL"],
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_test_engine)

# 替换 main.py / seed.py 中的全局 engine/SessionLocal，使 lifespan 与 seed_data 作用于测试库
main_module.engine = _test_engine
seed_module.SessionLocal = TestingSessionLocal

# 保存原始 seed_data，供 test_seed.py 恢复使用
_original_seed_data = seed_module.seed_data


def _noop_seed_data():
    """默认关闭自动 seed，避免干扰测试数据。"""
    pass


seed_module.seed_data = _noop_seed_data
main_module.seed_data = _noop_seed_data


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=_test_engine)
    Base.metadata.create_all(bind=_test_engine)
    yield
    Base.metadata.drop_all(bind=_test_engine)


@pytest.fixture
def db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def create_user(db, email, password, role="member", is_active=True):
    user = models.User(
        email=email,
        hashed_password=get_password_hash(password),
        role=role,
        is_active=is_active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def admin_user(db):
    return create_user(db, "admin@fmt.com", "fumate", role="admin")


@pytest.fixture
def member_user(db):
    return create_user(db, "member@fmt.com", "fumate", role="member")


@pytest.fixture
def inactive_user(db):
    return create_user(db, "inactive@fmt.com", "fumate", role="member", is_active=False)


@pytest.fixture
def another_user(db):
    return create_user(db, "another@fmt.com", "fumate", role="member")


@pytest.fixture
def admin_token(admin_user):
    return create_access_token(subject=admin_user.id)


@pytest.fixture
def member_token(member_user):
    return create_access_token(subject=member_user.id)


@pytest.fixture
def inactive_token(inactive_user):
    return create_access_token(subject=inactive_user.id)


@pytest.fixture
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def member_headers(member_token):
    return {"Authorization": f"Bearer {member_token}"}


@pytest.fixture
def inactive_headers(inactive_token):
    return {"Authorization": f"Bearer {inactive_token}"}


@pytest.fixture
def enable_seed(monkeypatch):
    """恢复原始 seed_data，用于 test_seed.py。"""
    monkeypatch.setattr(seed_module, "seed_data", _original_seed_data)
    monkeypatch.setattr(main_module, "seed_data", _original_seed_data)

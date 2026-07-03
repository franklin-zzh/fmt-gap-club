from app import models


def test_get_profile_creates_default(client, member_headers, member_user, db):
    response = client.get("/api/v1/profiles/me", headers=member_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == member_user.id
    assert data["gender"] == ""


def test_get_profile_existing(client, member_headers, member_user, db):
    profile = models.MemberProfile(user_id=member_user.id, gender="女", age=30)
    db.add(profile)
    db.commit()

    response = client.get("/api/v1/profiles/me", headers=member_headers)
    assert response.status_code == 200
    assert response.json()["gender"] == "女"


def test_update_profile_creates_new(client, member_headers, member_user):
    response = client.put("/api/v1/profiles/me", json={
        "gender": "男",
        "age": 25,
        "height": 175.5,
        "weight": 70.0,
        "health_goals": ["肠道健康"],
        "lifestyle_tags": ["久坐办公"],
        "allergies": "无",
        "medical_history": "无",
    }, headers=member_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["gender"] == "男"
    assert data["age"] == 25


def test_update_profile_existing(client, member_headers, member_user, db):
    profile = models.MemberProfile(user_id=member_user.id, gender="女")
    db.add(profile)
    db.commit()

    response = client.put("/api/v1/profiles/me", json={
        "gender": "男",
    }, headers=member_headers)
    assert response.status_code == 200
    assert response.json()["gender"] == "男"


def test_profile_requires_member(client, db):
    from app.core.security import create_access_token
    user = models.User(email="guest@fmt.com", hashed_password="x", role="guest")
    db.add(user)
    db.commit()
    db.refresh(user)
    headers = {"Authorization": f"Bearer {create_access_token(subject=user.id)}"}
    response = client.get("/api/v1/profiles/me", headers=headers)
    assert response.status_code == 403


def test_profile_admin_allowed(client, admin_headers):
    response = client.get("/api/v1/profiles/me", headers=admin_headers)
    assert response.status_code == 200

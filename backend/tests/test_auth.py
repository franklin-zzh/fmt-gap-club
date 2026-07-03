def test_register_success(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "new@fmt.com",
        "password": "password123",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "new@fmt.com"
    assert data["role"] == "member"


def test_register_duplicate_email(client, member_user):
    response = client.post("/api/v1/auth/register", json={
        "email": member_user.email,
        "password": "password123",
    })
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_register_with_role(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "admin2@fmt.com",
        "password": "password123",
        "role": "admin",
    })
    assert response.status_code == 200
    assert response.json()["role"] == "admin"


def test_login_success(client, member_user):
    response = client.post("/api/v1/auth/login", data={
        "username": member_user.email,
        "password": "fumate",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, member_user):
    response = client.post("/api/v1/auth/login", data={
        "username": member_user.email,
        "password": "wrong",
    })
    assert response.status_code == 400


def test_login_nonexistent_user(client):
    response = client.post("/api/v1/auth/login", data={
        "username": "nobody@fmt.com",
        "password": "password123",
    })
    assert response.status_code == 400


def test_me_success(client, member_headers, member_user):
    response = client.get("/api/v1/auth/me", headers=member_headers)
    assert response.status_code == 200
    assert response.json()["email"] == member_user.email


def test_me_no_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_me_inactive_user(client, inactive_headers):
    response = client.get("/api/v1/auth/me", headers=inactive_headers)
    assert response.status_code == 400

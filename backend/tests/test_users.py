def test_list_users_admin(client, admin_headers, admin_user, member_user):
    response = client.get("/api/v1/users", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    emails = [u["email"] for u in data]
    assert admin_user.email in emails
    assert member_user.email in emails


def test_list_users_with_q_filter(client, admin_headers, admin_user, member_user):
    response = client.get("/api/v1/users?q=member", headers=admin_headers)
    assert response.status_code == 200
    emails = [u["email"] for u in response.json()]
    assert member_user.email in emails
    assert admin_user.email not in emails


def test_list_users_with_role_filter(client, admin_headers, admin_user, member_user):
    response = client.get("/api/v1/users?role=admin", headers=admin_headers)
    assert response.status_code == 200
    emails = [u["email"] for u in response.json()]
    assert admin_user.email in emails
    assert member_user.email not in emails


def test_list_users_forbidden_for_member(client, member_headers):
    response = client.get("/api/v1/users", headers=member_headers)
    assert response.status_code == 403


def test_toggle_user_status(client, admin_headers, member_user):
    response = client.patch(f"/api/v1/users/{member_user.id}/status", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["is_active"] is False

    # toggle back
    response = client.patch(f"/api/v1/users/{member_user.id}/status", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["is_active"] is True


def test_toggle_user_status_not_found(client, admin_headers):
    response = client.patch("/api/v1/users/99999/status", headers=admin_headers)
    assert response.status_code == 404


def test_toggle_user_status_forbidden(client, member_headers, admin_user):
    response = client.patch(f"/api/v1/users/{admin_user.id}/status", headers=member_headers)
    assert response.status_code == 403

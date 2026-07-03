from app import models


def test_dashboard_admin(client, admin_headers, member_user, db):
    sub = models.Subscription(user_id=member_user.id, plan_type="monthly", status="active")
    db.add(sub)
    db.commit()

    response = client.get("/api/v1/dashboard", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_members"] == 1
    assert data["paid_members"] == 1
    assert data["total_visitors"] == 8
    assert data["conversion_rate"] == 12.5
    assert data["revenue"] == 299.0


def test_dashboard_forbidden(client, member_headers):
    response = client.get("/api/v1/dashboard", headers=member_headers)
    assert response.status_code == 403

from datetime import datetime, timedelta

from app import models


def test_get_my_subscription(client, member_headers, member_user, db):
    sub = models.Subscription(user_id=member_user.id, plan_type="monthly", status="active")
    db.add(sub)
    db.commit()

    response = client.get("/api/v1/subscriptions/me", headers=member_headers)
    assert response.status_code == 200
    assert response.json()["plan_type"] == "monthly"


def test_get_my_subscription_not_found(client, member_headers):
    response = client.get("/api/v1/subscriptions/me", headers=member_headers)
    assert response.status_code == 404


def test_renew_subscription_new(client, member_headers, member_user):
    response = client.post("/api/v1/subscriptions/me/renew", json={
        "plan_type": "yearly",
    }, headers=member_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["plan_type"] == "yearly"
    assert data["status"] == "active"
    assert data["expired_at"] is not None


def test_renew_subscription_existing_not_expired(client, member_headers, member_user, db):
    future = datetime.utcnow() + timedelta(days=30)
    sub = models.Subscription(
        user_id=member_user.id,
        plan_type="monthly",
        status="active",
        expired_at=future,
    )
    db.add(sub)
    db.commit()

    response = client.post("/api/v1/subscriptions/me/renew", json={
        "plan_type": "quarterly",
    }, headers=member_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["plan_type"] == "quarterly"


def test_renew_subscription_existing_expired(client, member_headers, member_user, db):
    past = datetime.utcnow() - timedelta(days=1)
    sub = models.Subscription(
        user_id=member_user.id,
        plan_type="monthly",
        status="expired",
        expired_at=past,
    )
    db.add(sub)
    db.commit()

    response = client.post("/api/v1/subscriptions/me/renew", json={
        "plan_type": "monthly",
    }, headers=member_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"


def test_list_subscriptions_admin(client, admin_headers, member_user, db):
    sub = models.Subscription(user_id=member_user.id, plan_type="monthly", status="active")
    db.add(sub)
    db.commit()

    response = client.get("/api/v1/subscriptions", headers=admin_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_list_subscriptions_forbidden(client, member_headers):
    response = client.get("/api/v1/subscriptions", headers=member_headers)
    assert response.status_code == 403

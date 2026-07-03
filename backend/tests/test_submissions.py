import os

from app import models
from app.core.config import get_settings


def test_list_submissions(client, member_headers, member_user, db):
    submission = models.HealthSubmission(user_id=member_user.id, answers={"q1": "a1"})
    db.add(submission)
    db.commit()

    response = client.get("/api/v1/submissions", headers=member_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1


def test_create_submission_without_file(client, member_headers, member_user, db):
    product = models.Product(name="肠道稳态营养包", target_group="肠道健康", tags=["gut-health"], is_active=True)
    profile = models.MemberProfile(user_id=member_user.id, health_goals=["肠道健康"])
    db.add_all([product, profile])
    db.commit()

    response = client.post("/api/v1/submissions", data={
        "answers": '{"goals": ["肠道健康"], "concerns": [], "lifestyle": []}',
    }, headers=member_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == member_user.id
    assert len(data["recommendations"]) >= 1


def test_create_submission_with_file(client, member_headers, member_user, db):
    response = client.post("/api/v1/submissions", data={
        "answers": '{}',
    }, files={
        "file": ("report.pdf", b"file content", "application/pdf"),
    }, headers=member_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["file_url"] != ""

    # cleanup uploaded file
    file_path = os.path.join(get_settings().UPLOAD_DIR, f"{member_user.id}_report.pdf")
    if os.path.exists(file_path):
        os.remove(file_path)


def test_get_submission(client, member_headers, member_user, db):
    submission = models.HealthSubmission(user_id=member_user.id, answers={})
    db.add(submission)
    db.commit()

    response = client.get(f"/api/v1/submissions/{submission.id}", headers=member_headers)
    assert response.status_code == 200
    assert response.json()["id"] == submission.id


def test_get_submission_not_found(client, member_headers):
    response = client.get("/api/v1/submissions/99999", headers=member_headers)
    assert response.status_code == 404


def test_submission_requires_member(client, db):
    from app.core.security import create_access_token
    user = models.User(email="guest@fmt.com", hashed_password="x", role="guest")
    db.add(user)
    db.commit()
    db.refresh(user)
    headers = {"Authorization": f"Bearer {create_access_token(subject=user.id)}"}
    response = client.get("/api/v1/submissions", headers=headers)
    assert response.status_code == 403


def test_submission_admin_allowed(client, admin_headers):
    response = client.get("/api/v1/submissions", headers=admin_headers)
    assert response.status_code == 200

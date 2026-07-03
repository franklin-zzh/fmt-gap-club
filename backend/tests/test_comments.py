from app import models


def test_list_comments(client, db):
    product = models.Product(name="P1")
    comment1 = models.Comment(user_name="A", content="C1", product_id=1)
    comment2 = models.Comment(user_name="B", content="C2", product_id=2)
    db.add_all([product, comment1, comment2])
    db.commit()

    response = client.get("/api/v1/comments")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_list_comments_with_product_id(client, db):
    product = models.Product(name="P1")
    comment = models.Comment(user_name="A", content="C1", product_id=1)
    db.add_all([product, comment])
    db.commit()

    response = client.get("/api/v1/comments?product_id=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["content"] == "C1"


def test_create_comment(client, admin_headers):
    response = client.post("/api/v1/comments", json={
        "product_id": 1,
        "user_name": "User",
        "avatar_url": "http://example.com/avatar.png",
        "content": "Great product!",
        "rating": 5,
        "metrics": {"改善指标": "10%"},
    }, headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "Great product!"


def test_create_comment_forbidden(client, member_headers):
    response = client.post("/api/v1/comments", json={"content": "X"}, headers=member_headers)
    assert response.status_code == 403

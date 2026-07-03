from datetime import datetime

from app import models


def test_list_articles(client, db):
    article1 = models.Article(title="Article 1", category="knowledge", is_active=True)
    article2 = models.Article(title="Article 2", category="research", is_active=True)
    inactive = models.Article(title="Inactive", is_active=False)
    db.add_all([article1, article2, inactive])
    db.commit()

    response = client.get("/api/v1/articles")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_list_articles_with_category(client, db):
    article = models.Article(title="Research Article", category="research", is_active=True)
    db.add(article)
    db.commit()

    response = client.get("/api/v1/articles?category=research")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Research Article"


def test_get_article(client, db):
    article = models.Article(title="Test Article")
    db.add(article)
    db.commit()

    response = client.get(f"/api/v1/articles/{article.id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Test Article"


def test_get_article_not_found(client):
    response = client.get("/api/v1/articles/99999")
    assert response.status_code == 404


def test_create_article(client, admin_headers):
    response = client.post("/api/v1/articles", json={
        "title": "New Article",
        "category": "knowledge",
        "summary": "summary",
        "content": "content",
        "published_at": datetime.utcnow().isoformat(),
        "is_active": True,
    }, headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "New Article"


def test_create_article_forbidden(client, member_headers):
    response = client.post("/api/v1/articles", json={"title": "X"}, headers=member_headers)
    assert response.status_code == 403


def test_update_article(client, admin_headers, db):
    article = models.Article(title="Old Title")
    db.add(article)
    db.commit()

    response = client.put(f"/api/v1/articles/{article.id}", json={
        "title": "Updated Title",
    }, headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"


def test_update_article_not_found(client, admin_headers):
    response = client.put("/api/v1/articles/99999", json={"title": "X"}, headers=admin_headers)
    assert response.status_code == 404


def test_delete_article(client, admin_headers, db):
    article = models.Article(title="To Delete", is_active=True)
    db.add(article)
    db.commit()

    response = client.delete(f"/api/v1/articles/{article.id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["detail"] == "Article deleted"

    db.refresh(article)
    assert article.is_active is False


def test_delete_article_not_found(client, admin_headers):
    response = client.delete("/api/v1/articles/99999", headers=admin_headers)
    assert response.status_code == 404

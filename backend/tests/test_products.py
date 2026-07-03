from app import models


def test_list_products(client, db):
    active = models.Product(name="Active Product", is_active=True, order_index=1)
    inactive = models.Product(name="Inactive Product", is_active=False, order_index=2)
    db.add_all([active, inactive])
    db.commit()

    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Active Product"


def test_get_product(client, db):
    product = models.Product(name="Test Product")
    db.add(product)
    db.commit()

    response = client.get(f"/api/v1/products/{product.id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Test Product"


def test_get_product_not_found(client):
    response = client.get("/api/v1/products/99999")
    assert response.status_code == 404


def test_create_product(client, admin_headers):
    response = client.post("/api/v1/products", json={
        "name": "New Product",
        "subtitle": "sub",
        "description": "desc",
        "target_group": "all",
        "tags": ["tag1"],
        "image_url": "http://example.com/img.png",
        "order_index": 5,
        "is_active": True,
    }, headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Product"


def test_create_product_forbidden(client, member_headers):
    response = client.post("/api/v1/products", json={"name": "X"}, headers=member_headers)
    assert response.status_code == 403


def test_update_product(client, admin_headers, db):
    product = models.Product(name="Old Name")
    db.add(product)
    db.commit()

    response = client.put(f"/api/v1/products/{product.id}", json={
        "name": "New Name",
    }, headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "New Name"


def test_update_product_not_found(client, admin_headers):
    response = client.put("/api/v1/products/99999", json={"name": "X"}, headers=admin_headers)
    assert response.status_code == 404


def test_delete_product(client, admin_headers, db):
    product = models.Product(name="To Delete", is_active=True)
    db.add(product)
    db.commit()

    response = client.delete(f"/api/v1/products/{product.id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["detail"] == "Product deleted"

    db.refresh(product)
    assert product.is_active is False


def test_delete_product_not_found(client, admin_headers):
    response = client.delete("/api/v1/products/99999", headers=admin_headers)
    assert response.status_code == 404

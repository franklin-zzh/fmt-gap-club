from app import models


def test_get_product_detail(client, db):
    product = models.Product(name="Product With Detail")
    db.add(product)
    db.commit()
    detail = models.ProductDetail(
        product_id=product.id,
        efficacy={"key": "value"},
        core_meal_replacement={"a": 1},
        synergistic_nutrients={"b": 2},
    )
    db.add(detail)
    db.commit()

    response = client.get(f"/api/v1/products/{product.id}/detail")
    assert response.status_code == 200
    data = response.json()
    assert data["product_id"] == product.id
    assert data["efficacy"] == {"key": "value"}


def test_get_product_detail_product_not_found(client):
    response = client.get("/api/v1/products/99999/detail")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"


def test_get_product_detail_missing_detail(client, db):
    product = models.Product(name="Product Without Detail")
    db.add(product)
    db.commit()

    response = client.get(f"/api/v1/products/{product.id}/detail")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product detail not found"


def test_create_product_detail(client, admin_headers, db):
    product = models.Product(name="New Detail Product")
    db.add(product)
    db.commit()

    response = client.post(
        f"/api/v1/products/{product.id}/detail",
        json={
            "efficacy": {"key": "value"},
            "core_meal_replacement": {"a": 1},
            "synergistic_nutrients": {"b": 2},
        },
        headers=admin_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["product_id"] == product.id
    assert data["efficacy"] == {"key": "value"}


def test_create_product_detail_product_not_found(client, admin_headers):
    response = client.post(
        "/api/v1/products/99999/detail",
        json={"efficacy": {}},
        headers=admin_headers,
    )
    assert response.status_code == 404


def test_create_product_detail_already_exists(client, admin_headers, db):
    product = models.Product(name="Duplicate Detail Product")
    db.add(product)
    db.commit()
    detail = models.ProductDetail(product_id=product.id)
    db.add(detail)
    db.commit()

    response = client.post(
        f"/api/v1/products/{product.id}/detail",
        json={"efficacy": {}},
        headers=admin_headers,
    )
    assert response.status_code == 409


def test_create_product_detail_forbidden(client, member_headers, db):
    product = models.Product(name="Forbidden Detail Product")
    db.add(product)
    db.commit()

    response = client.post(
        f"/api/v1/products/{product.id}/detail",
        json={"efficacy": {}},
        headers=member_headers,
    )
    assert response.status_code == 403


def test_update_product_detail(client, admin_headers, db):
    product = models.Product(name="Update Detail Product")
    db.add(product)
    db.commit()
    detail = models.ProductDetail(product_id=product.id, efficacy={"old": "value"})
    db.add(detail)
    db.commit()

    response = client.put(
        f"/api/v1/products/{product.id}/detail",
        json={"efficacy": {"new": "value"}},
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert response.json()["efficacy"] == {"new": "value"}


def test_update_product_detail_product_not_found(client, admin_headers):
    response = client.put(
        "/api/v1/products/99999/detail",
        json={"efficacy": {}},
        headers=admin_headers,
    )
    assert response.status_code == 404


def test_update_product_detail_missing_detail(client, admin_headers, db):
    product = models.Product(name="No Detail Product")
    db.add(product)
    db.commit()

    response = client.put(
        f"/api/v1/products/{product.id}/detail",
        json={"efficacy": {}},
        headers=admin_headers,
    )
    assert response.status_code == 404


def test_update_product_detail_forbidden(client, member_headers, db):
    product = models.Product(name="Forbidden Update Product")
    db.add(product)
    db.commit()

    response = client.put(
        f"/api/v1/products/{product.id}/detail",
        json={"efficacy": {}},
        headers=member_headers,
    )
    assert response.status_code == 403


def test_delete_product_detail(client, admin_headers, db):
    product = models.Product(name="Delete Detail Product")
    db.add(product)
    db.commit()
    detail = models.ProductDetail(product_id=product.id)
    db.add(detail)
    db.commit()

    response = client.delete(f"/api/v1/products/{product.id}/detail", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["detail"] == "Product detail deleted"


def test_delete_product_detail_product_not_found(client, admin_headers):
    response = client.delete("/api/v1/products/99999/detail", headers=admin_headers)
    assert response.status_code == 404


def test_delete_product_detail_missing_detail(client, admin_headers, db):
    product = models.Product(name="No Detail To Delete")
    db.add(product)
    db.commit()

    response = client.delete(f"/api/v1/products/{product.id}/detail", headers=admin_headers)
    assert response.status_code == 404


def test_delete_product_detail_forbidden(client, member_headers, db):
    product = models.Product(name="Forbidden Delete Product")
    db.add(product)
    db.commit()

    response = client.delete(f"/api/v1/products/{product.id}/detail", headers=member_headers)
    assert response.status_code == 403

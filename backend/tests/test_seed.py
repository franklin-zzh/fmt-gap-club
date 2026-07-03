from app import models
from app import seed as seed_module


def test_seed_data_empty_db(enable_seed, db):
    seed_module.seed_data()
    assert db.query(models.User).filter(models.User.email == "admin@fmt.com").first()
    assert db.query(models.User).filter(models.User.email == "member@fmt.com").first()
    assert db.query(models.Product).count() == len(seed_module.PRODUCTS)
    assert db.query(models.Article).count() == len(seed_module.ARTICLES)
    assert db.query(models.Comment).count() == len(seed_module.COMMENTS)


def test_seed_data_idempotent(enable_seed, db):
    seed_module.seed_data()
    seed_module.seed_data()
    assert db.query(models.User).filter(models.User.email == "admin@fmt.com").count() == 1
    assert db.query(models.User).filter(models.User.email == "member@fmt.com").count() == 1
    assert db.query(models.Product).count() == len(seed_module.PRODUCTS)

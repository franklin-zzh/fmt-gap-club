from app import models
from app.services.ai_matching import match_products


def test_match_products_empty(db):
    profile = None
    recommendations, summary = match_products(profile, {}, db)
    assert recommendations == []
    assert "暂无可用产品数据" in summary


def test_match_products_without_profile(db):
    product = models.Product(
        name="肠道稳态营养包",
        target_group="肠道健康",
        tags=["gut-health"],
        is_active=True,
    )
    db.add(product)
    db.commit()

    recommendations, summary = match_products(
        None,
        {"goals": ["肠道健康"], "concerns": [], "lifestyle": []},
        db,
    )
    assert len(recommendations) == 1
    assert recommendations[0]["product_id"] == product.id
    assert "1 项健康信号" in summary


def test_match_products_with_profile_and_answers(db, member_user):
    profile = models.MemberProfile(
        user_id=member_user.id,
        health_goals=["免疫力"],
        lifestyle_tags=["熬夜"],
    )
    db.add(profile)

    product = models.Product(
        name="免疫护盾营养包",
        target_group="免疫力 / 易感人群",
        tags=["immunity", "defense"],
        is_active=True,
    )
    db.add(product)
    db.commit()

    recommendations, summary = match_products(
        profile,
        {"goals": ["免疫力"], "concerns": ["immunity"], "lifestyle": ["熬夜"]},
        db,
    )
    assert len(recommendations) == 1
    assert recommendations[0]["score"] > 0


def test_match_products_target_group_keyword(db):
    product = models.Product(
        name="深眠修复营养包",
        target_group="睡眠 / 焦虑失眠",
        tags=["sleep"],
        is_active=True,
    )
    db.add(product)
    db.commit()

    recommendations, summary = match_products(
        None,
        {"goals": ["睡眠"], "concerns": [], "lifestyle": []},
        db,
    )
    assert len(recommendations) == 1
    assert "深眠修复营养包" in recommendations[0]["name"]

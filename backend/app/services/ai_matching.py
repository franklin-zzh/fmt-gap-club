from typing import List, Tuple
from sqlalchemy.orm import Session
from app import models


TAG_WEIGHTS = {
    "肠道健康": ["gut-health", "probiotic", "digestion"],
    "免疫力": ["immunity", "defense", "vitamin-c"],
    "睡眠": ["sleep", "relaxation", "melatonin"],
    "精力": ["energy", "fatigue", "b-vitamin"],
    "抗衰老": ["aging", "antioxidant", "cellular"],
    "体重管理": ["weight", "metabolism", "fiber"],
    "孕期营养": ["prenatal", "folate", "pregnancy"],
    "儿童发育": ["children", "growth", "dha"],
    "中老年": ["senior", "bone", "joint"],
    "运动恢复": ["sport", "recovery", "protein"],
}


def match_products(
    profile: models.MemberProfile,
    answers: dict,
    db: Session,
) -> Tuple[List[dict], str]:
    products = db.query(models.Product).filter(models.Product.is_active == True).all()
    if not products:
        return [], "暂无可用产品数据。"

    # Collect user intent signals
    signals = set()
    if profile:
        signals.update(profile.health_goals or [])
        signals.update(profile.lifestyle_tags or [])
    signals.update(answers.get("goals", []))
    signals.update(answers.get("concerns", []))
    signals.update(answers.get("lifestyle", []))
    signals = {s.lower() for s in signals}

    scored = []
    for product in products:
        score = 0
        product_tags = [t.lower() for t in (product.tags or [])]
        for tag in product_tags:
            if tag in signals:
                score += 2
        # boost by target group keywords
        target = product.target_group.lower()
        for signal in signals:
            if signal in target:
                score += 1
        scored.append((score, product))

    scored.sort(key=lambda x: x[0], reverse=True)
    top = scored[:3]

    recommendations = []
    for score, product in top:
        recommendations.append({
            "product_id": product.id,
            "name": product.name,
            "subtitle": product.subtitle,
            "score": score,
            "reason": f"基于您的健康档案与需求，{product.name} 的 {product.target_group} 定位与当前目标高度契合。",
        })

    summary = (
        f"根据您提供的 {len(signals)} 项健康信号，系统从 {len(products)} 款营养包中匹配出 "
        f"{len(recommendations)} 款高契合度方案，建议优先查看 TOP1 推荐。"
    )
    return recommendations, summary

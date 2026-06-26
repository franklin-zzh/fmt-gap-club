from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import get_password_hash
from app import models


PRODUCTS = [
    {"name": "肠道稳态营养包", "subtitle": "益生菌 + 膳食纤维复合配方", "description": "针对肠道菌群失衡、消化不适人群，重建肠道稳态环境。", "target_group": "肠道健康 / 消化敏感", "tags": ["gut-health", "probiotic", "digestion"], "order_index": 1},
    {"name": "免疫护盾营养包", "subtitle": "锌 + 维生素 C + 接骨木莓", "description": "强化先天免疫防线，适合换季易感、熬夜高压人群。", "target_group": "免疫力 / 易感人群", "tags": ["immunity", "defense", "vitamin-c"], "order_index": 2},
    {"name": "深眠修复营养包", "subtitle": "GABA + 镁 + 酸枣仁", "description": "调节昼夜节律，缩短入睡时间，提升深度睡眠比例。", "target_group": "睡眠 / 焦虑失眠", "tags": ["sleep", "relaxation", "melatonin"], "order_index": 3},
    {"name": "细胞能量营养包", "subtitle": "B 族维生素 + 辅酶 Q10", "description": "支持线粒体能量代谢，缓解慢性疲劳与脑力透支。", "target_group": "精力 / 慢性疲劳", "tags": ["energy", "fatigue", "b-vitamin"], "order_index": 4},
    {"name": "时光缓释营养包", "subtitle": "白藜芦醇 + 花青素 + NAD+ 前体", "description": "抗氧化与细胞修护双重路径，延缓生理年龄进程。", "target_group": "抗衰老 / 抗氧化", "tags": ["aging", "antioxidant", "cellular"], "order_index": 5},
    {"name": "轻盈代谢营养包", "subtitle": "膳食纤维 + 藤黄果 + 铬", "description": "调节血糖波动，增强饱腹感，辅助健康体重管理。", "target_group": "体重管理 / 代谢调节", "tags": ["weight", "metabolism", "fiber"], "order_index": 6},
    {"name": "孕产期营养包", "subtitle": "叶酸 + DHA + 铁", "description": "覆盖备孕期、孕期及哺乳期关键微量营养素需求。", "target_group": "孕期营养 / 备孕哺乳", "tags": ["prenatal", "folate", "pregnancy"], "order_index": 7},
    {"name": "成长力营养包", "subtitle": "DHA + 钙 + 维生素 D3", "description": "支持儿童认知发育与骨骼生长，3-12 岁适用。", "target_group": "儿童发育 / 成长关键期", "tags": ["children", "growth", "dha"], "order_index": 8},
    {"name": "银发守护营养包", "subtitle": "钙 + 维生素 K2 + 胶原蛋白", "description": "维护中老年骨骼、关节与心血管健康。", "target_group": "中老年 / 骨骼关节", "tags": ["senior", "bone", "joint"], "order_index": 9},
    {"name": "运动恢复营养包", "subtitle": "乳清蛋白 + BCAA + 电解质", "description": "训练后快速修复肌肉，补充电解质，减少延迟性酸痛。", "target_group": "运动恢复 / 健身人群", "tags": ["sport", "recovery", "protein"], "order_index": 10},
]


ARTICLES = [
    {"title": "FMT 微生态知识库：从肠道菌群到全身健康", "category": "knowledge", "summary": "系统梳理肠道菌群与代谢、免疫、神经系统的关联。", "content": "内容占位。"},
    {"title": "AI 个性化营养匹配模型技术白皮书", "category": "knowledge", "summary": "多维度健康信号融合与营养包推荐算法说明。", "content": "内容占位。"},
    {"title": "个性化算法：如何量化营养干预效果", "category": "knowledge", "summary": "从问卷设计到效果追踪的闭环逻辑。", "content": "内容占位。"},
    {"title": "益生菌与肠脑轴：2024 科研文献综述", "category": "research", "summary": "精选 12 篇高影响因子文献，解析肠脑轴机制。", "content": "内容占位。"},
]


COMMENTS = [
    {"user_name": "林女士", "content": "服用肠道稳态包两个月后，腹胀明显缓解，排便规律了很多。", "rating": 5, "metrics": {"改善指标": "腹胀 -80%"}},
    {"user_name": "张先生", "content": "深眠修复包让我入睡更快，早晨起床不再疲惫。", "rating": 5, "metrics": {"改善指标": "入睡时间 -35%"}},
    {"user_name": "王阿姨", "content": "银发守护包体检时骨密度指标稳定了，会继续坚持。", "rating": 5, "metrics": {"改善指标": "骨密度稳定"}},
    {"user_name": "陈小姐", "content": "免疫护盾包帮我度过了整个流感季没有感冒。", "rating": 5, "metrics": {"改善指标": "感冒次数 0"}},
]


def seed_data():
    db: Session = SessionLocal()
    try:
        # Seed admin user
        if not db.query(models.User).filter(models.User.email == "admin@fmt.com").first():
            admin = models.User(
                email="admin@fmt.com",
                hashed_password=get_password_hash("fumate"),
                role="admin",
            )
            db.add(admin)

        # Seed demo member
        if not db.query(models.User).filter(models.User.email == "member@fmt.com").first():
            member = models.User(
                email="member@fmt.com",
                hashed_password=get_password_hash("fumate"),
                role="member",
            )
            db.add(member)
            db.flush()
            db.add(models.MemberProfile(
                user_id=member.id,
                gender="女",
                age=32,
                health_goals=["肠道健康", "免疫力"],
                lifestyle_tags=["久坐办公", "熬夜"],
            ))
            db.add(models.Subscription(
                user_id=member.id,
                plan_type="quarterly",
                status="active",
            ))

        # Seed products
        if db.query(models.Product).count() == 0:
            for p in PRODUCTS:
                db.add(models.Product(**p))

        # Seed articles
        if db.query(models.Article).count() == 0:
            for a in ARTICLES:
                db.add(models.Article(**a))

        # Seed comments
        if db.query(models.Comment).count() == 0:
            products = db.query(models.Product).all()
            for i, c in enumerate(COMMENTS):
                c["product_id"] = products[i % len(products)].id if products else None
                db.add(models.Comment(**c))

        db.commit()
    finally:
        db.close()

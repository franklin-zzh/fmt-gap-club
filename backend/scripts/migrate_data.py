"""
数据迁移脚本：将 SQLite 数据迁移到 MySQL。

用法：
    python scripts/migrate_data.py

环境变量：
    SQLITE_URL    - SQLite 数据库 URL（默认：sqlite:///./data/gapclub.db）
    MYSQL_URL     - MySQL 数据库 URL
                    默认：mysql+pymysql://root:fumate@127.0.0.1:3306/gap_club?charset=utf8mb4

注意：
    1. 请确保 MySQL 数据库 gap_club 已创建：
       CREATE DATABASE gap_club CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    2. 迁移会保留所有行的 ID 以保证外键关系完整。
    3. 脚本以幂等方式运行：会先清空 MySQL 中的目标表再写入。
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import json
from datetime import datetime
from sqlalchemy import create_engine, MetaData, Table, inspect, text, JSON
from app.db.base import Base
from app import models  # noqa: F401 - 注册所有模型到 Base.metadata

# 写入顺序（按外键依赖，被引用的表先写入）
TABLE_ORDER = [
    "users",
    "products",
    "articles",
    "comments",
    "member_profiles",
    "health_submissions",
    "subscriptions",
]


def get_sqlite_data(sqlite_url: str) -> dict:
    """从 SQLite 读取所有表的数据，返回 {table_name: [row_dict, ...]}"""
    engine = create_engine(sqlite_url)
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    data = {}
    with engine.connect() as conn:
        for table_name in TABLE_ORDER:
            if table_name not in existing_tables:
                print(f"  [SQLite] 表 {table_name}: 不存在，跳过")
                continue

            columns_info = inspector.get_columns(table_name)
            columns = [col["name"] for col in columns_info]
            json_columns = {col["name"] for col in columns_info if isinstance(col["type"], JSON)}
            result = conn.execute(text(f"SELECT * FROM {table_name}"))
            rows = result.fetchall()

            table_data = []
            for row in rows:
                row_dict = dict(zip(columns, row))
                # 确保 datetime 对象是原生 Python datetime
                for k, v in row_dict.items():
                    if isinstance(v, datetime):
                        row_dict[k] = v.replace(tzinfo=None)
                    # SQLite 以文本形式存储 JSON，迁移到 MySQL 前需反序列化
                    if k in json_columns and isinstance(v, str):
                        try:
                            row_dict[k] = json.loads(v)
                        except json.JSONDecodeError:
                            pass
                table_data.append(row_dict)

            data[table_name] = table_data
            print(f"  [SQLite] 表 {table_name}: {len(table_data)} 行")

    engine.dispose()
    return data


def migrate_to_mysql(mysql_url: str, data: dict):
    """在 MySQL 中建表并写入数据"""
    engine = create_engine(mysql_url)

    # 1. 在 MySQL 中创建表
    print("\n  正在 MySQL 中创建表结构...")
    Base.metadata.create_all(bind=engine)
    print("  表结构创建完成。")

    # 2. 写入数据
    meta = MetaData()
    meta.reflect(bind=engine)

    with engine.begin() as conn:
        # 禁用外键检查，避免 delete 时外键冲突
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 0"))

        # 清空所有目标表
        for table_name in TABLE_ORDER:
            if table_name in data:
                conn.execute(text(f"DELETE FROM {table_name}"))
                print(f"  [MySQL] 清空表 {table_name}")

        conn.execute(text("SET FOREIGN_KEY_CHECKS = 1"))

        # 按顺序写入数据
        for table_name in TABLE_ORDER:
            rows = data.get(table_name)
            if not rows:
                continue

            table = meta.tables[table_name]
            conn.execute(table.insert(), rows)
            print(f"  [MySQL] 写入表 {table_name}: {len(rows)} 行")

    print("\n数据迁移完成！")
    engine.dispose()


def main():
    sqlite_url = os.getenv("SQLITE_URL", "sqlite:///./data/gapclub.db")
    mysql_url = os.getenv(
        "MYSQL_URL",
        "mysql+pymysql://root:fumate@127.0.0.1:3306/gap_club?charset=utf8mb4",
    )

    print("=" * 60)
    print("  SQLite -> MySQL 数据迁移工具")
    print("=" * 60)
    print(f"\n  源(SQLite): {sqlite_url}")
    mysql_display = mysql_url.split("@")[-1] if "@" in mysql_url else mysql_url
    print(f"  目标(MySQL): {mysql_display}")

    # 读取 SQLite
    print("\n第 1 步：从 SQLite 读取数据...")
    data = get_sqlite_data(sqlite_url)

    if not data:
        print("未读取到任何数据，退出。")
        sys.exit(1)

    total = sum(len(rows) for rows in data.values())
    print(f"\n  共读取 {total} 条记录，来自 {len(data)} 个表")

    # 写入 MySQL
    print("\n第 2 步：写入 MySQL...")
    try:
        migrate_to_mysql(mysql_url, data)
    except Exception as e:
        print(f"\n迁移失败：{e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

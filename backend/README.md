# GAP Club Backend

基于 **FastAPI + SQLAlchemy 2.0 + MySQL 8** 构建的会员制微生态营养平台后端服务，提供用户认证、健康档案、检测报告提交、AI 营养推荐、订阅支付等 RESTful API。

## 🛠️ 技术栈

| 技术 | 说明 |
|---|---|
| Python 3.10+ | 运行语言 |
| FastAPI 0.110+ | Web 框架 / 自动生成 OpenAPI |
| Uvicorn | ASGI 服务器 |
| SQLAlchemy 2.0+ | ORM |
| Alembic | 数据库迁移（当前项目使用 `create_all` 自动建表） |
| Pydantic / Pydantic Settings | 配置与数据校验 |
| python-jose + passlib | JWT 鉴权与密码哈希 |
| PyMySQL | MySQL 驱动 |
| pytest + pytest-cov | 单元测试与覆盖率 |
| 阿里云 OSS | 产品图片等静态资源存储 |

## 📂 目录结构

```
backend/
├── app/
│   ├── api/              # 路由层
│   │   ├── api.py        # API 总路由器聚合
│   │   ├── deps.py       # JWT / 权限依赖
│   │   └── v1/           # 各业务模块路由
│   │       ├── auth.py       # 注册 / 登录 / 当前用户
│   │       ├── users.py      # 用户管理
│   │       ├── profiles.py   # 会员健康档案
│   │       ├── submissions.py# 健康数据提交与 AI 报告
│   │       ├── subscriptions.py # 会员订阅
│   │       ├── products.py   # 产品列表
│   │       ├── product_details.py
│   │       ├── articles.py   # 知识库文章
│   │       ├── comments.py   # 文章评论
│   │       └── dashboard.py  # 管理员看板
│   ├── core/             # 核心配置与安全
│   │   ├── config.py     # Settings（环境变量）
│   │   └── security.py   # JWT、密码哈希
│   ├── db/               # 数据库
│   │   ├── base.py       # 模型基类
│   │   ├── session.py    # Engine + SessionLocal
│   │   └── 模型定义在 app/models/__init__.py
│   ├── models/           # SQLAlchemy 模型
│   ├── schemas/          # Pydantic 序列化/反序列化
│   ├── services/         # 业务逻辑
│   │   ├── ai_matching.py # AI 营养推荐算法
│   │   └── oss.py        # 阿里云 OSS 上传
│   ├── static/           # 本地静态文件（上传报告等）
│   ├── main.py           # FastAPI 应用入口
│   └── seed.py           # 初始化示例数据
├── tests/                # pytest 测试用例
├── scripts/              # 数据迁移/维护脚本
├── requirements.txt      # Python 依赖
├── Dockerfile            # 容器镜像
└── .env.example          # 环境变量模板
```

## ⚙️ 环境变量与参数说明

复制 `.env.example` 为 `.env` 并按需修改：

| 变量名 | 默认值 | 说明 |
|---|---|---|
| `PROJECT_NAME` | `FMT Microecology Platform` | FastAPI 文档标题 |
| `API_V1_STR` | `/api/v1` | API 路由前缀 |
| `SECRET_KEY` | `super-secret-key-change-in-production` | JWT 签名密钥，**生产必须替换** |
| `ALGORITHM` | `HS256` | JWT 算法 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` (7 天) | Access Token 有效期 |
| `DATABASE_URL` | `mysql+pymysql://root:fumate@127.0.0.1:3306/gap_club?charset=utf8mb4` | MySQL 连接串 |
| `UPLOAD_DIR` | `./app/static/uploads` | 本地上传目录 |
| `REPORT_DIR` | `./app/static/reports` | 报告生成目录 |
| `ALIYUN_OSS_ACCESS_KEY_ID` | - | 阿里云 OSS AccessKey ID |
| `ALIYUN_OSS_ACCESS_KEY_SECRET` | - | 阿里云 OSS AccessKey Secret |
| `ALIYUN_OSS_BUCKET_NAME` | `fmt-gap-club` | OSS Bucket |
| `ALIYUN_OSS_ENDPOINT` | `oss-cn-beijing.aliyuncs.com` | OSS Endpoint |
| `ALIYUN_OSS_CDN_BASE_URL` | `https://assets.gapclub.fmtcloud.cn` | OSS CDN 域名 |
| `ALIYUN_OSS_PRODUCTS_PREFIX` | `products` | 产品图片在 OSS 上的前缀 |

## 🔄 核心业务流程

### 1. 注册 / 登录 / JWT 鉴权

```
POST /api/v1/auth/register   -> 创建用户（默认 role=member）
POST /api/v1/auth/login      -> 返回 access_token（JWT）
GET  /api/v1/auth/me         -> 携带 Bearer Token 获取当前用户
```

`app/api/deps.py` 提供三类依赖：

- `get_current_active_user`：普通会员/管理员通用登录校验
- `require_admin`：仅管理员
- `require_member`：仅会员

### 2. 健康档案 → 提交检测 → AI 推荐 → 报告

```
会员
  │
  ▼
PUT /api/v1/profiles/me         完善健康档案（health_goals、lifestyle_tags、allergies 等）
  │
  ▼
POST /api/v1/submissions        上传检测报告/问卷答案（multipart/form-data）
  │
  ▼
AI 匹配（services/ai_matching.py）
  - 合并 profile 中的健康目标、生活方式标签
  - 与 submissions.answers 中的 goals / concerns / lifestyle 取并集
  - 计算产品 tags / target_group 与信号词的匹配得分
  - 返回 TOP3 推荐与 summary
  │
  ▼
GET /api/v1/submissions         查询提交记录（含 recommendations、summary、status）
```

### 3. 订阅支付

```
POST /api/v1/subscriptions/me/renew  -> 创建/续期订阅（plan_type: monthly/yearly）
GET  /api/v1/subscriptions/me        -> 查询当前订阅状态
```

## 💻 本地开发

### 前置条件

- Python 3.10+
- MySQL 8（推荐使用项目根目录 `docker-compose.yml` 一键启动）

### 1. 启动 MySQL（Docker）

```bash
cd <project-root>
docker compose up -d global-mysql8
```

### 2. 安装依赖并运行后端

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
python -m pip install -r requirements.txt

# 运行开发服务器（带热重载）
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

启动后：

- API 地址：`http://127.0.0.1:8000/api/v1`
- 自动文档：`http://127.0.0.1:8000/docs`
- 健康检查：`http://127.0.0.1:8000/health`

### 3. 运行测试

```bash
cd backend
pytest
pytest --cov=app --cov-report=html
```

测试报告将生成在 `htmlcov/index.html`。

## 🐳 Docker 构建（后端独立）

```bash
cd backend
docker build -t gapclub-backend:latest .
docker run -d -p 8000:8000 --env-file .env gapclub-backend:latest
```

> 生产环境推荐使用项目根目录的 `docker-compose.yml` 统一编排前后端 + MySQL。

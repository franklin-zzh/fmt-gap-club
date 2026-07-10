# GAP Club 养好菌小屋

一个面向肠道微生态与营养健康场景的会员制 Web 平台，包含官网落地页、会员健康档案、AI 营养推荐、检测报告提交、订阅支付及管理员后台。

> 项目采用前后端分离架构：
> - 前端：`frontend/`（React 18 + Vite 6 + Tailwind CSS）
> - 后端：`backend/`（FastAPI + SQLAlchemy + MySQL 8）

---

## 🛠️ 技术栈概览

| 层级 | 主要技术 |
|---|---|
| 前端 | React 18、Vite 6、Tailwind CSS 3、Radix UI、Framer Motion、Axios、React Router v6、@tanstack/react-query |
| 后端 | Python 3.10、FastAPI、Uvicorn、SQLAlchemy 2.0、Pydantic、python-jose、passlib、PyMySQL |
| 数据库 | MySQL 8.0 |
| 中间件/基础设施 | Docker、Nginx、阿里云 OSS、Stripe |

---

## 📂 项目结构

```
gapClub/
├── backend/                 # FastAPI 后端
│   ├── app/
│   │   ├── api/v1/          # 业务路由
│   │   ├── core/            # 配置 & 安全
│   │   ├── db/              # ORM & 数据库连接
│   │   ├── models/          # 数据模型
│   │   ├── schemas/         # Pydantic 模型
│   │   ├── services/        # 业务逻辑（AI 匹配、OSS 上传）
│   │   ├── main.py          # FastAPI 入口
│   │   └── seed.py          # 示例数据初始化
│   ├── tests/               # pytest 测试
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                # React 前端
│   ├── src/
│   │   ├── api/             # Axios 封装
│   │   ├── components/      # 业务/UI 组件
│   │   ├── lib/             # AuthContext、query-client 等
│   │   ├── pages/           # 页面组件
│   │   └── App.jsx          # 路由总入口
│   ├── vite.config.js       # 开发代理配置
│   ├── package.json
│   └── .env.example
├── docker-compose.yml       # MySQL + 后端 + 前端 一键编排
└── README.md                # 本文件
```

---

## 💻 本地开发

### 方式一：Docker Compose 一键启动（推荐）

确保已安装 Docker 和 Docker Compose，然后执行：

```bash
# 1. 复制后端环境变量并填写必要配置
cp backend/.env.example backend/.env
# 编辑 backend/.env，填写数据库、OSS 等真实参数

# 2. 启动全部服务
docker compose up -d --build

# 3. 查看运行状态
docker compose ps
```

启动后访问：

| 服务 | 地址 |
|---|---|
| 前端页面 | http://localhost:3000 |
| 后端 API | http://localhost:8000/api/v1 |
| API 文档 | http://localhost:8000/docs |
| 健康检查 | http://localhost:8000/health |

> `docker-compose.yml` 中已包含 MySQL 8 容器，无需单独安装数据库。

### 方式二：手动分别启动前后端

#### 1. 启动 MySQL

```bash
# 使用 docker-compose 只启动数据库
docker compose up -d global-mysql8
```

或自行安装 MySQL 8 并创建数据库 `gap_club`，字符集 `utf8mb4`。

#### 2. 启动后端

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
python -m pip install -r requirements.txt

# 复制并编辑环境变量
cp .env.example .env
# 编辑 .env 中的 DATABASE_URL、SECRET_KEY、OSS 等参数

# 启动开发服务器
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### 3. 启动前端

```bash
cd frontend
npm install

# 复制并编辑环境变量
cp .env.example .env.local
# 编辑 .env.local

npm run dev
```

默认访问：`http://localhost:5173`

---

## 🔌 前后端联调

### 1. 接口地址约定

后端所有业务接口统一挂在 `/api/v1` 前缀下，由 `backend/app/api/api.py` 聚合各模块路由：

| 模块 | 基础路径 |
|---|---|
| 认证 | `/api/v1/auth` |
| 用户 | `/api/v1/users` |
| 健康档案 | `/api/v1/profiles` |
| 数据提交 | `/api/v1/submissions` |
| 订阅 | `/api/v1/subscriptions` |
| 产品 | `/api/v1/products` |
| 知识库 | `/api/v1/articles` |
| 评论 | `/api/v1/comments` |
| 管理员看板 | `/api/v1/dashboard` |

### 2. 开发环境代理

`frontend/vite.config.js` 已配置 Vite 开发代理：

```js
server: {
  proxy: {
    '/api': { target: 'http://localhost:8000', changeOrigin: true },
    '/static': { target: 'http://localhost:8000', changeOrigin: true },
  },
}
```

因此前端在 `.env.local` 中配置 `VITE_API_BASE_URL=/api/v1` 后，请求 `/api/v1/xxx` 会自动代理到本地 `http://localhost:8000/api/v1/xxx`，无需额外处理 CORS。

### 3. 前端调用链路

```
页面组件
  │
  ▼
@/api/entityApi 或 @/api/client.js
  - entityApi：按实体封装 CRUD（users、profiles、submissions、subscriptions 等）
  - client.js：Axios 实例，统一 baseURL、JWT 携带、401 处理
  │
  ▼
Vite 代理（开发） / Nginx 反向代理（生产）
  │
  ▼
FastAPI /api/v1/* 路由
  │
  ▼
SQLAlchemy ORM → MySQL
```

### 4. JWT 鉴权流程

```
1. 用户登录 / 注册
   POST /api/v1/auth/login
   返回 { access_token, token_type: "bearer" }

2. 前端存储 token
   localStorage.setItem("fmt_access_token", access_token)

3. 后续请求自动携带
   Axios 请求拦截器读取 localStorage 并添加 Header: Authorization: Bearer <token>

4. 后端校验
   app/api/deps.py 中的 get_current_user 解析 JWT 并查询用户

5. 401 统一处理
   Axios 响应拦截器捕获 401，清除 token 并派发 auth:session-expired 事件，
   AuthContext / ProtectedRoute 负责跳转登录页
```

### 5. 跨域调试

若前端需要直接访问后端 IP（例如真机或局域网调试）：

1. 前端 `.env.local` 设置：
   ```
   VITE_API_BASE_URL=http://<后端IP>:8000/api/v1
   ```
2. 后端 `app/main.py` 的 `CORSMiddleware.allow_origins` 中追加前端地址：
   ```python
   allow_origins=[
       "http://localhost:5173",
       "http://<前端IP>:5173",
       "https://gapclub.fmtcloud.cn",
   ]
   ```

---

## 🌐 生产部署

### 1. 构建前端

```bash
cd frontend
npm install
npm run build
```

产物位于 `frontend/dist/`，可直接部署到 Nginx / CDN / 静态托管。

### 2. 构建后端

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

或使用后端 Dockerfile：

```bash
cd backend
docker build -t gapclub-backend:latest .
docker run -d -p 8000:8000 --env-file .env gapclub-backend:latest
```

### 3. Docker Compose 生产编排

项目根目录 `docker-compose.yml` 已定义 MySQL、后端、前端的完整生产镜像构建与网络：

```bash
cd <project-root>
docker compose up -d --build
```

- 前端容器内部使用 Nginx 提供 SPA 静态服务，并代理 `/api/`、`/static/` 到后端容器。
- 后端容器监听 `0.0.0.0:8000`。
- MySQL 数据通过命名卷 `mysql_data` 持久化。

### 4. 云服务器部署

部署云服务器参考钉钉-知识库/研发 & 技术/项目/部署项目-阿里云服务器。

> 部署前请确保：
> - 后端 `.env` 中的 `SECRET_KEY` 已替换为强随机字符串；
> - 生产数据库 URL 指向云数据库或自建 MySQL；
> - 阿里云 OSS AccessKey、Stripe 密钥等敏感配置已正确填写；
> - 服务器安全组放行 80/443 以及后端所需端口。

---

## ⚙️ 核心环境变量速查

### 后端 `backend/.env`

| 变量名 | 说明 |
|---|---|
| `DATABASE_URL` | MySQL 连接串，示例 `mysql+pymysql://root:fumate@127.0.0.1:3306/gap_club?charset=utf8mb4` |
| `SECRET_KEY` | JWT 签名密钥，**生产必须修改** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT 有效期，默认 7 天 |
| `ALIYUN_OSS_ACCESS_KEY_ID` | 阿里云 OSS AccessKey ID |
| `ALIYUN_OSS_ACCESS_KEY_SECRET` | 阿里云 OSS AccessKey Secret |
| `ALIYUN_OSS_BUCKET_NAME` | OSS Bucket 名称 |
| `ALIYUN_OSS_ENDPOINT` | OSS Endpoint |
| `ALIYUN_OSS_CDN_BASE_URL` | OSS CDN 域名 |

### 前端 `frontend/.env.local`

| 变量名 | 说明 |
|---|---|
| `VITE_API_BASE_URL` | 后端 API 基础路径，开发可填 `/api/v1` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe 公钥 |
| `VITE_APP_OSS_BASE_URL` | OSS / CDN 基础地址 |

---

## 🧪 常用命令

```bash
# 后端测试
cd backend && pytest

# 后端测试覆盖率
cd backend && pytest --cov=app --cov-report=html

# 前端 Lint
cd frontend && npm run lint

# 前端类型检查
cd frontend && npm run typecheck

# 前端生产构建
cd frontend && npm run build

# Docker 全量重启
docker compose down
docker compose up -d --build
```

---

## 📖 更多文档

- 前端详细说明：`frontend/README.md`
- 后端详细说明：`backend/README.md`
- API 接口文档：启动后端后访问 `/docs`（Swagger UI）

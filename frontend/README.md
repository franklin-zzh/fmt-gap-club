# GAP Club Frontend

基于 **React 18 + Vite 6 + Tailwind CSS** 构建的会员制微生态营养平台前端，覆盖官网落地页、会员中心、管理员后台三大模块。

## 🚀 特性亮点

- **🛡️ 渐进式类型检查**：通过 `jsconfig.json` 的 `checkJs: true` 在原生 JavaScript (JSX) 上获得 TypeScript 类型提示。
- **🔐 统一鉴权**：Axios 拦截器自动携带 JWT，统一处理 401 会话过期事件。
- **🎨 原子化 UI**：Tailwind CSS 3 + Radix UI 原语（shadcn/ui 风格），配合 Framer Motion 实现细腻转场。
- **📊 业务组件丰富**：支付（Stripe）、图表（Recharts）、3D 场景（Three.js）、地图（Leaflet）、富文本（React Quill）、Markdown 渲染、PDF 导出等。

## 🛠️ 技术栈

| 技术 | 用途 |
|---|---|
| React 18 | 核心 UI 框架 |
| Vite 6 | 构建工具 + HMR 开发服务器 |
| React Router v6 | 前端路由 |
| @tanstack/react-query v5 | 服务端状态缓存 |
| Tailwind CSS 3 | 原子化样式 |
| Radix UI | 无头组件原语 |
| Framer Motion | 动画与页面过渡 |
| Axios | HTTP 客户端 |
| Zod + React Hook Form | 表单校验 |
| Stripe | 支付 |
| Recharts | 数据可视化 |
| Three.js | 3D 视觉 |

## 📂 目录结构

```
frontend/
├── public/                 # 静态资源
├── src/
│   ├── api/                # API 封装
│   │   ├── client.js       # Axios 实例：baseURL、JWT、401 拦截
│   │   ├── entityApi.js    # 各实体通用 CRUD
│   │   └── member.js       # 会员相关 API（旧版，推荐用 entityApi）
│   ├── components/         # 组件
│   │   ├── landing/        # 官网首页组件
│   │   ├── member/         # 会员中心组件
│   │   ├── admin/          # 后台组件
│   │   └── ui/             # shadcn/ui 基础组件
│   ├── lib/                # 工具与上下文
│   │   ├── AuthContext.jsx # 全局登录态
│   │   └── query-client.js # react-query 配置
│   ├── pages/              # 页面级组件
│   │   ├── Home.jsx        # 官网首页
│   │   ├── Login.jsx       # 登录
│   │   ├── Register.jsx    # 注册
│   │   ├── MemberInit.jsx  # 会员初始页（AI 分析动画引导）
│   │   ├── member/         # 会员中心子页面
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Submissions.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Subscription.jsx
│   │   └── admin/          # 管理员后台子页面
│   ├── App.jsx             # 路由总入口
│   └── main.jsx            # React 挂载入口
├── package.json
├── vite.config.js          # Vite 配置 + 开发代理
├── jsconfig.json           # 路径别名 @/* + checkJs
├── tailwind.config.js      # Tailwind 主题扩展
└── components.json         # shadcn/ui 配置
```

## ⚙️ 环境变量与参数说明

开发环境可在项目根目录创建 `.env.local`（Vite 默认读取）：

| 变量名 | 示例值 | 说明 |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` 或 `/api/v1` | 后端 API 基础路径。开发时若使用 Vite 代理，建议填 `/api/v1` |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_test_xxx` | Stripe 公钥，用于前端调起支付 |
| `VITE_APP_OSS_BASE_URL` | `https://assets.gapclub.fmtcloud.cn` | 阿里云 OSS / CDN 基础地址 |

> Vite 要求前端环境变量必须以 `VITE_` 开头才能在代码中通过 `import.meta.env.VITE_XXX` 读取。

## 🔄 主要页面流程

### 1. 官网与引导

```
/                     首页（官网）
/knowledge-base       知识库文章列表
/member/init          会员初始页：选择健康关注点 → AI 分析动画 → 引导注册
```

`MemberInit.jsx` 现在内置 AI 分析动画（`AiAnalysisVisualizer`），模拟 AI 解析用户健康信号并生成推荐，最后引导创建账号。

### 2. 认证

```
/login                登录，成功后写入 localStorage: fmt_access_token
/register             注册，成功后自动登录
```

### 3. 会员中心（需登录，role=member/admin）

```
/member               工作台 Dashboard
/member/profile       完善健康档案
/member/submissions   提交健康检测报告
/member/reports       查看 AI 营养报告
/member/subscription  会员订阅与支付
```

### 4. 管理员后台（需 role=admin）

```
/admin                管理员看板
/admin/members        会员管理
/admin/products       产品管理
/admin/knowledge      知识库管理
```

## 💻 本地开发

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local
```

### 3. 启动开发服务器

```bash
npm run dev
```

默认访问：`http://localhost:5173`

### 4. 常用脚本

| 脚本 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器（Vite HMR） |
| `npm run build` | 生产构建，输出到 `dist/` |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | ESLint 检查 |
| `npm run lint:fix` | ESLint 自动修复 |
| `npm run typecheck` | TypeScript 对 JS/JSX 做类型检查 |

## 🔌 与后端联调

- 开发时 Vite 已配置代理（见 `vite.config.js`）：
  - `/api/*` → `http://localhost:8000`
  - `/static/*` → `http://localhost:8000`
- 因此只要设置 `VITE_API_BASE_URL=/api/v1`，前端请求会经 Vite 代理转发到本地后端，无需处理跨域。
- 如需直接访问后端（如真机调试），可设置 `VITE_API_BASE_URL=http://<后端IP>:8000/api/v1`，同时确保后端 `app/main.py` 的 `CORSMiddleware` 已放行该前端地址。

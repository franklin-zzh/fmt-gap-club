# GAP Club

一个基于 React 18 + Vite 6 + FastAPI 构建的现代化、全功能的**中后台及会员制 Web 应用程序**。本项目集成了支付、图表、3D 渲染、地图及富文本编辑器等核心业务模块，采用原子化样式与无障碍组件库，具备生产级别的容器化部署能力。

## 🚀 特性亮点

- **🛡️ 渐进式类型检查**：利用 TypeScript 的 `checkJs` 模式，在不增加编译负担的情况下，为原生 JavaScript (JSX) 带来全方位的静态类型提示。
    
- **🔐 健壮的鉴权系统**：基于 Axios 封装的客户端，深度集成 JWT 自动拦截与刷新机制，完美对接 FastAPI 后端。
    
- **🎨 极致的 UI 体验**：采用 **Tailwind CSS 3 + Radix UI 原语**（shadcn/ui 风格），配合 **Framer Motion** 实现细腻的页面过渡与交互动画。
    
- **📊 丰富的业务组件**：
    
    - **支付系统**：集成 Stripe 线上支付及会员订阅流程。
        
    - **数据可视化**：基于 Recharts 的动态数据看板。
        
    - **地理信息**：React Leaflet 交互式地图嵌入。
        
    - **3D 交互**：引入 Three.js 实现炫酷的 3D 视觉渲染。
        
    - **生产力工具**：包含 React Quill 富文本编辑器、CMDK 全局命令面板、Markdown 渲染及 PDF 异步导出（html2canvas + jsPDF）。
        

## 🛠️ 技术栈总览

### 🧠 开发语言与基底

- **主要语言**：JavaScript (JSX) / API 层基于 `.js`
    
- **类型辅助**：TypeScript (仅检查模式，通过 `jsconfig.json` 的 `"checkJs": true` 实现)
    
- **样式架构**：CSS + Tailwind CSS 3（基于 `tailwind.config.js` 与全局变量配置）
    

### ⚛️ 核心框架与状态

|**技术**|**用途说明**|
|---|---|
|**React 18**|核心 UI 构建框架（`react` + `react-dom`）|
|**Vite 6**|下一代前端构建工具与极其暴躁的 HMR 开发服务器|
|**React Router v6**|前端声明式路由管理（`BrowserRouter` + `Route` + `Maps`）|
|**@tanstack/react-query v5**|强大的服务端状态同步、异步请求与缓存管理利器|

### 🎨 UI / 视觉 / 交互

- **无障碍原语**：`Radix UI` (深度集成 Dialog, Dropdown, Accordion, Tabs, Select, Toast 等 20+ 组件)
    
- **设计风格**：`shadcn/ui` 规范 (通过 `components.json` 及 CSS 变量自定义主题色如 `--primary`, `--background`)
    
- **动效引擎**：`Framer Motion` (利用 `AnimatePresence` + `motion.div` 实现优雅的路由与组件过渡)
    
- **图标与通知**：`Lucide React` 图标库 + `Sonner` / `react-hot-toast` 异步全局通知
    

### 📋 表单与校验

- **表单状态**：`React Hook Form` —— 高性能、零不必要重绘的表单状态管理
    
- **数据校验**：`Zod` —— 运行时 Schema 校验与类型推导
    
- **桥接工具**：`@hookform/resolvers` —— 完美的 RHF ↔ Zod 表单验证粘合剂
    

### 📦 核心业务与增强库

- **金融支付**：`@stripe/react-stripe-js`
    
- **内容编辑**：`react-quill` (富文本) + `react-markdown` (Markdown 解析)
    
- **数据看板**：`recharts` (轻量级高可定制图表)
    
- **地图组件**：`react-leaflet` (基于 OpenStreetMap 的交互地图)
    
- **时间处理**：`date-fns` / `moment`
    
- **图形渲染**：`three` (WebGL / 3D 场景支持)
    
- **文档导出**：`html2canvas` + `jsPDF` (前端一键生成并下载 PDF 报表)
    
- **快捷交互**：`cmdk` (像 Raycast 一样爽快的全局命令面板)
    

## 📂 项目关键配置

- **`jsconfig.json`**：配置了路径别名 `@/*` 指向 `src/*`，并开启了 `"checkJs": true`，配合 `@ts-check` 或 JSDoc 实现无编译成本的类型安全。
    
- **`components.json`**：符合 `shadcn/ui` 架构的组件初始化配置文件。
    
- **`@/api/client.js`**：封装了 Axios 实例，统一管理 baseUrl、请求/响应拦截器，以及 JWT Token 的存储与携带逻辑。
    

## 💻 本地开发指南

### 1. 克隆并安装依赖

Bash

```
git clone <repository-url>
cd base44-app
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件，并根据后端 FastAPI 的部署情况配置 API 路径：

Code snippet

```
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 3. 启动开发服务器

Bash

```
npm run dev
```

> 访问 [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) 查看应用。

### 4. 代码类型检查

虽然不需要编译 TS，但在提交代码前可以通过以下命令对项目内的 JS/JSX 进行严格的类型检查：

Bash

```
npm run check-types
```

## 🐳 生产部署 (Docker + Nginx)

项目已经内置了生产级容器化部署方案，通过 Nginx 反向代理解决单页应用（SPA）的路由刷新 404 问题。

### 1. 构建 Docker 镜像

Bash

```
docker build -t g क्लब-frontend:latest .
```

### 2. 运行容器

Bash

```
docker run -d -p 80:80 --name gap-club-web gap-club-frontend:latest
```

> **配置文件说明：**
> 
> - `Dockerfile`：采用多阶段构建（Multi-stage build）。第一阶段基于 Node.js 镜像动态打包，第二阶段将打包后的 `dist` 静态资源拷贝至轻量级的 `nginx:alpine` 镜像中。
>     
> - `nginx.conf`：配置了 `try_files $uri $uri/ /index.html;`，确保 React Router 的浏览器历史路由（BrowserRouter）在刷新页面时能被正确接管。
>
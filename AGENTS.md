# GAP Club — FMT Microecology Platform

Membership-based health/diet platform with AI-powered matching.  
Stack: Python FastAPI backend + React 18 frontend (Vite + Tailwind CSS + shadcn/ui) + MySQL 8.0.

---

## Project

- **What**: A platform where members submit health data, get AI-matched product recommendations, and manage subscriptions.
- **Entry (backend)**: `backend/app/main.py` — FastAPI app with lifespan that auto-creates tables and seeds data.
- **Entry (frontend)**: `frontend/src/main.jsx` — React 18 root.
- **Config**: `backend/app/core/config.py` (Pydantic `Settings`, reads `.env`).

## Commands

| What | Command |
|---|---|
| **Backend dev** | `cd backend && python -m uvicorn app.main:app --reload` (port 8000) |
| **Backend install** | `cd backend && python -m pip install -r requirements.txt` |
| **Backend tests** | `cd backend && python -m pytest` (uses SQLite, requires 100% coverage) |
| **Frontend dev** | `cd frontend && npm run dev` (port 5173, proxies `/api` → `:8000`) |
| **Frontend build** | `cd frontend && npm run build` |
| **Frontend lint** | `cd frontend && npm run lint` |
| **Docker** | `docker compose up -d --build` (MySQL + backend + frontend/Nginx) |

## Architecture

### Backend (`backend/app/`)

| Module | Role |
|---|---|
| `main.py` | FastAPI app, CORS, lifespan (create tables + seed), health endpoint |
| `api/v1/` | 10 route modules: auth, products, articles, comments, profiles, submissions, subscriptions, dashboard, users, product_details |
| `core/` | `config.py` (settings), `security.py` (JWT + bcrypt) |
| `models/` | SQLAlchemy ORM models: User, Product, ProductDetail, Article, Comment, MemberProfile, HealthSubmission, Subscription |
| `schemas/` | Pydantic v2 request/response schemas (uses `from_attributes=True`, `EmailStr`, `field_validator`) |
| `services/` | `ai_matching.py` (recommendation logic), `oss.py` (Aliyun OSS upload) |
| `db/` | `session.py` (engine + SessionLocal + get_db), `base.py` (declarative Base) |
| `seed.py` | Initial data seeder run at startup |
| `tests/` | pytest suite with SQLite, 100% coverage required |

### Frontend (`frontend/src/`)

| Module | Role |
|---|---|
| `api/` | Axios client modules: `client.js`, `auth.js`, `admin.js`, `member.js`, `public.js`, `entityApi.js` |
| `pages/` | Route-level pages: `Login`, `Register`, `Home`, `KnowledgeBasePage`, `MemberInit`, plus `admin/` and `member/` subdirs |
| `components/` | Shared UI: `AuthLayout`, `ProtectedRoute`, `ScrollToTop`, `ui/` (shadcn primitives), `admin/`, `member/`, `landing/` |
| `stores/` | State: `auth.js` (Pinia), `admin.js`, `member.js` |
| `lib/` | Utilities: `AuthContext.jsx` (React context), `utils.js`, `query-client.js` (TanStack Query) |
| `hooks/` | Custom React hooks |
| *Vue remnants* | `main.js`, `App.vue`, `views/`, components/`HelloWorld.vue` — leftovers from Vue→React migration; not the active entry |

### Data Model

- **User** → one **MemberProfile**, many **HealthSubmission**, one **Subscription**
- **Product** → one **ProductDetail** (1:1 via FK), many **Comment**
- **Article** — knowledge-base / research content with category flag

## Conventions

### Backend
- **Router pattern**: `router = APIRouter(prefix="/<name>", tags=["<name>"])` in `api/v1/<name>.py`, registered in `api/api.py` under `/api/v1`.
- **CRUD style**: Inline queries in route handlers (no repository layer) — `db.query(models.X).filter(...).first()`.
- **Auth**: `Depends(get_current_active_user)` / `Depends(require_admin)` / `Depends(require_member)` from `api/deps.py`.
- **Response schemas**: Every endpoint uses `response_model=schemas.XxxResponse` with Pydantic `from_attributes=True`.
- **Tests**: SQLite in-memory, `autouse` fixture resets DB per function, 100% coverage (`--cov-fail-under=100`).
- **JSON columns**: Stored as JSON in MySQL; schemas have `_parse_json_string` helper for SQLite compatibility.

### Frontend
- **Components**: shadcn/ui colocation pattern — each component in its own folder under `components/ui/`.
- **Imports**: `@/` alias maps to `src/` (e.g., `import { Button } from "@/components/ui/button"`).
- **Styling**: Tailwind CSS via `className`, `cn()` utility from `tailwind-merge` + `clsx`.
- **Icons**: `lucide-react` for all icons.
- **Routing**: React Router v6, routes defined in `src/router/index.js`.
- **API calls**: Axios instance in `src/api/client.js` (base URL from env, interceptors for auth token).
- **State**: Pinia stores for auth/admin/member; React Context for auth state.
- **Form validation**: `react-hook-form` + `zod`.

### General
- **Config**: `.env` files at `backend/` and `frontend/` (see `.env.example`).
- **Docker**: Production uses Nginx to serve the built frontend and proxy `/api` to backend.
- **DB migration**: Tables are auto-created via `Base.metadata.create_all()` on startup; no Alembic migration workflow used yet.

## Notes

<!-- Quick-add section for future observations -->

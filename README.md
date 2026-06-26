# 终端 1：后端（8002 端口）
cd backend
python -m uvicorn app.main:app --reload --port 8002

# 终端 2：前端（5173 端口）
cd frontend01
npx vite
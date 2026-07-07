# 终端 1：后端（8000 端口）
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# 终端 2：前端（5173 端口）
cd frontend01
npm run dev

# docker
docker ps
docker compose up -d --build
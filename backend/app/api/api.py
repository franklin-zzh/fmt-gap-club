from fastapi import APIRouter
from app.api.v1 import auth, users, products, articles, comments, profiles, submissions, subscriptions, dashboard, product_details

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(products.router)
api_router.include_router(product_details.router)
api_router.include_router(articles.router)
api_router.include_router(comments.router)
api_router.include_router(profiles.router)
api_router.include_router(submissions.router)
api_router.include_router(subscriptions.router)
api_router.include_router(dashboard.router)

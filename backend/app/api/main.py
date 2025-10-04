from fastapi import APIRouter

from app.api.routes import tasklists, auth

api_router = APIRouter()
api_router.include_router(tasklists.router)
api_router.include_router(auth.router)

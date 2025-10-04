from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.db import init_db
from app.core.config import settings
from app.api.main import api_router

app = FastAPI(title=settings.PROJECT_NAME, version="1.0")

origins = [
    "http://localhost:3000",
    "https://todo.kempler.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
def on_startup():
    init_db()

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from pydantic import ValidationError
from app.core.db import get_session
from app.core.security import create_access_token, create_refresh_token
from app import crud
from app.models import UserCreate, Token, TokenRefresh
from app.core.config import settings
from datetime import datetime
from app.api.deps import (
    SessionDep,
)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
def register_user(session: SessionDep, payload: UserCreate):
    existing = crud.get_user_by_email(session=session, email=payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = crud.create_user(session=session, user_create=payload)
    access = create_access_token(sub=user.email)
    refresh = create_refresh_token(sub=user.email)
    return {"access_token": access, "refresh_token": refresh}


@router.post("/login", response_model=Token)
def login_user(session: SessionDep, payload: UserCreate):
    user = crud.authenticate(session=session, email=payload.email, password=payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access = create_access_token(sub=user.email)
    refresh = create_refresh_token(sub=user.email)
    return {"access_token": access, "refresh_token": refresh}


@router.post("/refresh", response_model=Token)
def refresh_token(data: TokenRefresh):
    try:
        payload = jwt.decode(data.refresh_token, settings.SECRET_KEY, algorithms=[settings.SECRET_KEY_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except (JWTError, ValidationError):
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    email = payload.get("email")
    access = create_access_token(sub=email)
    new_refresh = create_refresh_token(sub=email)
    return {"access_token": access, "refresh_token": new_refresh}


@router.post("/logout")
def logout_user():
    # For stateless JWTs, simply delete tokens on the client.
    return JSONResponse({"message": "Logged out"})

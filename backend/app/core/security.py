from datetime import datetime, timedelta, timezone
from jose import jwt
import bcrypt
from app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def create_access_token(*, sub: str):
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": int(expire.timestamp()), "type": "access", "sub": sub}
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.SECRET_KEY_ALGORITHM,
    )


def create_refresh_token(*, sub: str):
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": int(expire.timestamp()), "type": "refresh", "sub": sub}
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.SECRET_KEY_ALGORITHM,
    )

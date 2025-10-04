from typing import Generator

from sqlmodel import SQLModel, create_engine, Session

from app.core.config import settings

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

def init_db() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

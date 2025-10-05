import uuid
from datetime import datetime

from typing import Union

from sqlmodel import Session, select
from app.core.security import get_password_hash, verify_password

from app.models import User, UserCreate, TaskList, TaskListUpdate

def create_user(*, session: Session, user_create: UserCreate) -> User:
    print(f"{repr(user_create.password)}")
    new_user = User.model_validate(
        user_create,
        update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(session=session, email=email)
    if user and verify_password(password, user.hashed_password):
        return user
    return None


def get_tasklist_by_user(*, session: Session, user_id: uuid.UUID) -> TaskList | None:
    statement = select(TaskList).where(TaskList.user_id == user_id)
    tasklist = session.exec(statement).first()
    return tasklist


def get_or_create_tasklist(*, session: Session, user_id: uuid.UUID) -> TaskList:
    tasklist = get_tasklist_by_user(session=session, user_id=user_id)
    if tasklist:
        return tasklist

    new_tasklist = TaskList(user_id=user_id)
    session.add(new_tasklist)
    session.commit()
    session.refresh(new_tasklist)
    return new_tasklist


def update_tasklist_if_newer(
        *, session: Session, user_id: uuid.UUID, update_tasklist: TaskListUpdate
) -> [TaskList, Union['created', 'updated', 'ignored']]:
    new_tasklist_data = TaskListUpdate.model_validate(update_tasklist)

    tasklist = get_tasklist_by_user(session=session, user_id=user_id)
    if not tasklist:
        new_tasklist = get_or_create_tasklist(session=session, user_id=user_id)
        new_tasklist.title = new_tasklist_data.title;
        new_tasklist.tasks = new_tasklist_data.tasks;
        session.add(new_tasklist)
        session.commit()
        session.refresh(new_tasklist)
        return (new_tasklist, 'created')

    if new_tasklist_data.updated_at < tasklist.updated_at:
        # Client has an outdated task list, ignore.
        return (tasklist, 'ignored')

    tasklist.tasks = new_tasklist_data.tasks
    tasklist.title = new_tasklist_data.title
    tasklist.updated_at = datetime.utcnow()
    session.add(tasklist)
    session.commit()
    session.refresh(tasklist)
    return (tasklist, 'updated')


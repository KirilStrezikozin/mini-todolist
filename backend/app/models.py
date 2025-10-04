import uuid
from datetime import datetime
from typing import List, Optional, Union

from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


# Database model
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tasklists: List["TaskList"] = Relationship(back_populates="user", cascade_delete=True)


# Properties to return via API
class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime


# Shared properties
class TaskListBase(SQLModel):
    title: str = Field(default="", nullable=False)
    tasks_json: dict = Field(
        sa_column=Column(JSON, nullable=False, default={})
    )


# Properties to receive via API on creation
class TaskListCreate(TaskListBase):
    user_id: uuid.UUID = Field(foreign_key="user.id")


# Properties to receive via API on update
class TaskListUpdate(TaskListBase):
    updated_at: datetime


# Database model
class TaskList(TaskListBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    # One TaskList per User, hence unique=True.
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, unique=True, ondelete="CASCADE")
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional["User"] = Relationship(back_populates="tasklists")


# Properties to return via API
class TaskListPublic(TaskListBase):
    id: uuid.UUID
    user_id: uuid.UUID
    updated_at: datetime


# Collection responses
class UsersPublic(SQLModel):
    data: List[UserPublic]
    count: int


class TaskListsPublic(SQLModel):
    data: List[TaskListPublic]
    count: int


# Token properties
class Token(SQLModel):
    access_token: str
    refresh_token: str


class TokenRefresh(SQLModel):
    refresh_token: str

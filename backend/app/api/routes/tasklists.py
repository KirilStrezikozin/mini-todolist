from fastapi import APIRouter, HTTPException
from app import crud
from app.models import TaskListPublic, TaskListUpdate
from app.api.deps import (
    SessionDep,
    CurrentUser,
)

router = APIRouter(prefix="/tasklist", tags=["tasklist"])


@router.get("/", response_model=TaskListPublic)
def get_tasklist(session: SessionDep, current_user: CurrentUser):
    tasklist = crud.get_or_create_tasklist(session=session, user_id=current_user.id)
    return tasklist


@router.put("/", response_model=TaskListPublic)
def put_tasklist(session: SessionDep, current_user: CurrentUser, payload: TaskListUpdate):
    tasklist, status = crud.update_tasklist_if_newer(
        session=session,
        user_id=current_user.id,
        update_tasklist=payload,
    )

    if status == "ignored":
        raise HTTPException(
            status_code=409,
            detail="Task list is outdated, synchornize first"
        )

    return tasklist

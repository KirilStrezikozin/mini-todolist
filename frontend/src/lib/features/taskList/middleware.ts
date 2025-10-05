import { ActionCreatorWithPayload, Middleware } from "@reduxjs/toolkit";
import { isActionType } from "@/lib/utils";
import { setError } from "../error/slice";
import { TaskSchema } from "./schema";
import {
  addTask,
  changeTaskCompleted,
  changeTaskIndentLevel,
  changeTaskName,
  changeTaskPriority,
  removeTask,
  setTasks,
  taskListSlice
} from "./slice";

export const validationMiddleware: Middleware = store => next => action => {
  if (!(action as ActionCreatorWithPayload<unknown>).type.startsWith(taskListSlice.name)) {
    return next(action);
  }

  if (isActionType(action, addTask)) {
    const res = TaskSchema.safeParse(action.payload);
    if (!res.success) {
      store.dispatch(setError("Could not add a task with invalid data"));
      return;
    }
  } else if (isActionType(action, setTasks)) {
    const success = action.payload.every(task => TaskSchema.safeParse(task).success);
    if (!success) {
      store.dispatch(setError("Could not set task(s) with invalid data"));
      return;
    }
  } else if (isActionType(action, changeTaskName)) {
    if (!action.payload.name.length) {
      /* Remove to-do tasks with empty text. UI should dispatch a
       * `changeTaskName` action when the task loses focus, as such the task is
       * not deleted while the user is editing its text. */
      store.dispatch(removeTask(action.payload.index));
      return;
    }
  } else if (isActionType(action, changeTaskPriority)) {
    const res = TaskSchema.def.shape.priority.safeParse(action.payload.priority);
    if (!res.success) {
      store.dispatch(setError("Invalid task priority value"));
      return;
    }
  } else if (isActionType(action, changeTaskIndentLevel)) {
    const res = TaskSchema.def.shape.indentLevel.safeParse(action.payload.indentLevel);
    if (!res.success) {
      store.dispatch(setError("Invalid task indent level"));
      return;
    }
  } else if (isActionType(action, changeTaskCompleted)) {
    const res = TaskSchema.def.shape.completed.safeParse(action.payload.completed);
    if (!res.success) {
      store.dispatch(setError("Invalid task completion state"));
      return;
    }
  }

  return next(action);
}
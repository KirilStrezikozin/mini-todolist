import api from "@/lib/api/axios";
import { AxiosResponse } from "axios";

import { localStorageConfig } from "@/config/localStorage";
import { AppThunk } from "@/lib/store";
import { setError } from "../error/slice";
import { selectSyncStatus, setSyncStatus, setTaskList } from "./slice";

import {
  TaskListPublicDBSchema,
  TaskListState,
  TaskListStateSchema,
  TaskListUpdateDB
} from "./schema";

// TODO: create an async thunk that is triggered on state change.
// It either quits immediately if there is one already in flight, or marks itself in flight, waits for a delay (10s),
// then computes updated_at, puts state into DB, then dispatches updated_at change.

export const fetchTaskListDB = (): AppThunk => {
  return (dispatch, getState) => {
    const syncStatus = selectSyncStatus(getState());
    if (syncStatus !== "idle") return;

    dispatch(setSyncStatus("pulling"));

    const reject = () => {
      dispatch(setError("Failed to load task list from your account"));
      dispatch(setSyncStatus("idle"));
    };

    /* Assume that `api`'s interceptor will attach authorization headers. */
    api({ method: "get", url: "tasklist" })
      .then(({ data }) => {
        try {
          const taskListDB = TaskListPublicDBSchema.parse(JSON.parse(data));
          const newState = TaskListStateSchema.decode({
            ...taskListDB,
            syncStatus: "idle",
          });

          dispatch(setTaskList(newState));
        } catch (error) {
          /* Parsing error. */
          console.log(error);
          reject();
        }
      })
      .catch(() => reject());
  };
}

export const putTaskListDB = (data: TaskListUpdateDB): AppThunk => {
  return (dispatch, getState) => {
    const syncStatus = selectSyncStatus(getState());
    if (syncStatus !== "idle") return;

    dispatch(setSyncStatus("pushing"));

    const reject = () => {
      dispatch(setError("Failed to sync task list to your account"));
      dispatch(setSyncStatus("idle"));
    };

    /* Assume that `api`'s interceptor will attach authorization headers. */
    api({ method: "put", url: "tasklist", data: data })
      .then(({ data }) => {
        try {
          /* The returned task list data has the new updated_at value. */
          const taskListDB = TaskListPublicDBSchema.parse(JSON.parse(data));
          const newState = TaskListStateSchema.decode({
            ...taskListDB,
            syncStatus: "idle",
          });

          dispatch(setTaskList(newState));
        } catch (error) {
          /* Parsing error. */
          console.log(error);
          reject();
        }
      })
      .catch((error) => {
        if (!error.response) {
          reject();
          return;
        }

        const resp = (error.response as AxiosResponse);
        if (resp.status !== 409) {
          reject();
          return;
        }

        /* API server replies with 409 conflict status in case the given task
         * list data is outdated. Then fetch is needed first. */
        dispatch(setSyncStatus("idle"));
        dispatch(fetchTaskListDB());
      });
  };
}

export const loadLocalTaskListState = (): TaskListState | undefined => {
  try {
    const state = localStorage.getItem(localStorageConfig.taskListKey);
    if (!state) return undefined;
    return TaskListStateSchema.parse(JSON.parse(state));
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export const saveLocalTaskListState = (state: TaskListState | undefined) => {
  try {
    localStorage.setItem(localStorageConfig.taskListKey, JSON.stringify(state));
  } catch (err) {
    console.error(err);
  }
}
import api from "@/lib/api/axios";
import { AxiosResponse } from "axios";

import { localStorageConfig } from "@/config/localStorage";
import { AppThunk } from "@/lib/store";
import { setError } from "../error/slice";
import { selectIsSyncScheduled, selectSyncStatus, setIsSyncScheduled, setSyncStatus, setTaskList } from "./slice";

import {
  TaskListPublicDBSchema,
  TaskListState,
  TaskListStateSchema,
  TaskListUpdateDB
} from "./schema";


export const schedulePutTaskListDB = (): AppThunk => {
  return (dispatch, getState) => {
    if (selectIsSyncScheduled(getState())) return; /* Allow a single scheduled sync in flight. */

    dispatch(setIsSyncScheduled(true));

    const delay = (Number(process.env.TASKLIST_SYNC_FREQUENCY_SECONDS) || 10) * 1000;
    const sync = () => {
      const state = getState();

      const syncStatus = selectSyncStatus(state);
      if (syncStatus !== "idle") {
        /* Try again after delay if there is a sync operation currently in flight. */
        setTimeout(sync, delay);
        return;
      }

      dispatch(putTaskListDB({
        title: state.taskList.title,
        updated_at: state.taskList.updated_at,
        tasks: state.taskList.tasks,
      }));

      dispatch(setIsSyncScheduled(false));
    }

    setTimeout(sync, delay);
  };
}

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
            ...getState().taskList, /* Propagate unmodified props. */
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
          const taskListDB = TaskListPublicDBSchema.parse(JSON.parse(data));
          const newState = TaskListStateSchema.decode({
            ...getState().taskList, /* Propagate unmodified props. */
            ...taskListDB, /* Response data has the new updated_at value. */
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
import api from "@/lib/api/axios";
import { AxiosResponse } from "axios";

import { localStorageConfig } from "@/config/localStorage";
import { AppThunk } from "@/lib/store";
import { setError } from "../error/slice";
import { selectIsSyncScheduled, selectSyncStatus, selectTaskList, setIsSyncScheduled, setIsTaskListDirty, setSyncStatus, setTaskList } from "./slice";

import {
  TaskListPublicDBSchema,
  TaskListState,
  TaskListStateSchema,
  TaskListUpdateDB
} from "./schema";

import { getSession, signOut } from "next-auth/react";


export const schedulePutTaskListDB = (): AppThunk => {
  return async (dispatch, getState) => {
    await getSession().then(session => {
      if (!session?.user) return; /* Skip synchronization if not logged in. */

      if (selectIsSyncScheduled(getState())) return; /* Allow a single scheduled sync in flight. */
      dispatch(setIsSyncScheduled(true));

      //console.log("scheduled");

      const delay = (Number(process.env.TASKLIST_SYNC_FREQUENCY_SECONDS) || 10) * 1000;
      const sync = () => {
        const state = getState();

        const syncStatus = selectSyncStatus(state);
        if (syncStatus !== "idle") {
          /* Try again after delay if there is a sync operation currently in flight. */
          setTimeout(sync, delay);
          return;
        }

        //console.log("sent");
        dispatch(putTaskListDB({
          title: state.taskList.title,
          updated_at: state.taskList.updated_at,
          tasks: state.taskList.tasks,
        }));

        dispatch(setIsSyncScheduled(false));
      }

      setTimeout(sync, delay);
    });
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
    api({ method: "get", url: "tasklist/" })
      .then(({ data }) => {
        try {
          const taskListDB = TaskListPublicDBSchema.parse(data);

          const oldState = selectTaskList(getState());
          const newState: TaskListState = {
            title: taskListDB.title,
            tasks: taskListDB.tasks,
            updated_at: taskListDB.updated_at,
            syncStatus: "idle",
            syncScheduled: oldState.syncScheduled,
            dirty: false,
          };

          //console.log("replace with", newState);
          dispatch(setTaskList(newState));
          dispatch(saveLocalTaskListState(newState));
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
  return async (dispatch, getState) => {
    const syncStatus = selectSyncStatus(getState());
    if (syncStatus !== "idle") return;

    dispatch(setSyncStatus("pushing"));

    const reject = () => {
      dispatch(setError("Failed to sync task list to your account"));
      dispatch(setSyncStatus("idle"));
    };

    const rejectLogout = async () => {
      dispatch(setError("Please relogin"));
      dispatch(setSyncStatus("idle"));
      await signOut();
    };

    /* Assume that `api`'s interceptor will attach authorization headers. */
    api({ method: "put", url: "tasklist/", data: data })
      .then(({ data }) => {
        try {
          const taskListDB = TaskListPublicDBSchema.parse(data);
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
      .catch(async (error) => {
        if (!error.response) {
          reject();
          return;
        }

        const resp = (error.response as AxiosResponse);
        if (resp.status === 401) {
          await rejectLogout();
          return;
        } else if (resp.status !== 409) {
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

export const loadLocalTaskListState = (): AppThunk => {
  return dispatch => {
    try {
      const state = localStorage.getItem(localStorageConfig.taskListKey);
      if (!state) return;

      const newState = TaskListStateSchema.parse(JSON.parse(state));
      dispatch(setTaskList(newState));

    } catch (err) {
      console.error(err);
      dispatch(setError("Failed to load offline task list"));
    }
  };
}

export const saveLocalTaskListState = (state?: TaskListState): AppThunk => {
  return (dispatch, getState) => {
    try {
      state = state ? state : getState().taskList;
      localStorage.setItem(localStorageConfig.taskListKey, JSON.stringify(state));
      dispatch(setIsTaskListDirty(false));
    } catch (err) {
      console.error(err);
      dispatch(setError("Failed to save offline task list"));
    }
  };
}
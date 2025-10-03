import {
  Action,
  ActionCreatorWithPayload,
  configureStore,
  Middleware,
  ThunkAction
} from "@reduxjs/toolkit"

import errorReducer from "./features/error/slice";
import taskListReducer from "./features/taskList/slice";
import {
  validationMiddleware as taskListValidationMiddleware
} from "./features/taskList/middleware";

let lastAtionType: string | null = null;

const lastActionMiddleware: Middleware = () => next => action => {
  lastAtionType = (action as ActionCreatorWithPayload<unknown>).type;
  return next(action);
}

export const selectLastActionType = () => lastAtionType;

export const makeStore = () => {
  return configureStore({
    reducer: {
      taskList: taskListReducer,
      error: errorReducer,
    },
    middleware: gDM => gDM().concat(
      taskListValidationMiddleware,
      lastActionMiddleware,
    ),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
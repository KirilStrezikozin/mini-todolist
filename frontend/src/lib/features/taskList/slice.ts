import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskListState } from "./schema";
import { RootState } from "@/lib/store";
import { dateWithoutTimezone } from "@/lib/utils";

const initialState: TaskListState = {
  title: "",
  tasks: [],
  updated_at: dateWithoutTimezone(new Date(0)),
  syncStatus: "idle",
  syncScheduled: false,
  dirty: false,
};

export const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    setTaskList: (_state, action: PayloadAction<TaskListState | undefined>) => {
      if (action.payload) return action.payload;
    },
    setSyncStatus: (state, action: PayloadAction<TaskListState["syncStatus"]>) => {
      state.syncStatus = action.payload;
    },
    setIsSyncScheduled: (state, action: PayloadAction<boolean>) => {
      state.syncScheduled = action.payload;
    },
    setIsTaskListDirty: (state, action: PayloadAction<boolean>) => {
      state.dirty = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      state.dirty = true;
    },
    removeTask: (state, action: PayloadAction<number>) => {
      state.tasks.splice(action.payload, 1);
      state.dirty = true;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.dirty = true;
    },
    moveTaskUp: (state, action: PayloadAction<number>) => {
      if (action.payload === 0) return;
      [
        state.tasks[action.payload],
        state.tasks[action.payload - 1],
      ] = [
          state.tasks[action.payload - 1],
          state.tasks[action.payload],
        ];
      state.dirty = true;
    },
    moveTaskDown: (state, action: PayloadAction<number>) => {
      if (action.payload === state.tasks.length - 1) return;
      [
        state.tasks[action.payload],
        state.tasks[action.payload + 1],
      ] = [
          state.tasks[action.payload + 1],
          state.tasks[action.payload],
        ];
      state.dirty = true;
    },
    changeTitle: (state, action: PayloadAction<TaskListState["title"]>) => {
      state.title = action.payload;
      state.dirty = true;
    },
    changeTaskCompleted: (state, action: PayloadAction<{ index: number, completed: Task["completed"] }>) => {
      state.tasks[action.payload.index].completed = action.payload.completed;
      state.dirty = true;
    },
    changeTaskPriority: (state, action: PayloadAction<{ index: number, priority: Task["priority"] }>) => {
      state.tasks[action.payload.index].priority = action.payload.priority;
      state.dirty = true;
    },
    changeTaskName: (state, action: PayloadAction<{ index: number, name: Task["name"] }>) => {
      state.tasks[action.payload.index].name = action.payload.name;
      state.dirty = true;
    },
    changeTaskIndentLevel: (state, action: PayloadAction<{ index: number, indentLevel: Task["indentLevel"] }>) => {
      state.tasks[action.payload.index].indentLevel = action.payload.indentLevel;
      state.dirty = true;
    },
  },
});

export const getNextTaskKey = (tasks: TaskListState["tasks"]): Task["key"] => {
  let nextKey = 0;
  tasks.forEach(task => {
    if (task.key > nextKey) nextKey = task.key;
  });
  return nextKey + 1;
}

export const selectTaskList = (state: RootState) => state.taskList;
export const selectSyncStatus = (state: RootState) => state.taskList.syncStatus;
export const selectIsSyncScheduled = (state: RootState) => state.taskList.syncScheduled;
export const selectIsTaskListDirty = (state: RootState) => state.taskList.dirty;
export const selectTasks = (state: RootState) => state.taskList.tasks;
export const selectTitle = (state: RootState) => state.taskList.title;

export const {
  setTaskList,
  setSyncStatus,
  setIsSyncScheduled,
  setIsTaskListDirty,
  addTask,
  removeTask,
  setTasks,
  moveTaskUp,
  moveTaskDown,
  changeTitle,
  changeTaskCompleted,
  changeTaskPriority,
  changeTaskName,
  changeTaskIndentLevel
} = taskListSlice.actions;

export default taskListSlice.reducer;
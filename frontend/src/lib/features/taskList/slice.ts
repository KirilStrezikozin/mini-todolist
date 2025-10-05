import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskListState } from "./schema";
import { RootState } from "@/lib/store";
import { dateWithoutTimezone } from "@/lib/utils";

const initialState: TaskListState = {
  title: "",
  tasks: [],
  updated_at: dateWithoutTimezone(new Date()),
  syncStatus: "idle",
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
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<number>) => {
      state.tasks.splice(action.payload, 1);
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
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
    },
    changeTitle: (state, action: PayloadAction<TaskListState["title"]>) => {
      state.title = action.payload;
    },
    changeTaskCompleted: (state, action: PayloadAction<{ index: number, completed: Task["completed"] }>) => {
      state.tasks[action.payload.index].completed = action.payload.completed;
    },
    changeTaskPriority: (state, action: PayloadAction<{ index: number, priority: Task["priority"] }>) => {
      state.tasks[action.payload.index].priority = action.payload.priority;
    },
    changeTaskName: (state, action: PayloadAction<{ index: number, name: Task["name"] }>) => {
      state.tasks[action.payload.index].name = action.payload.name;
    },
    changeTaskIndentLevel: (state, action: PayloadAction<{ index: number, indentLevel: Task["indentLevel"] }>) => {
      state.tasks[action.payload.index].indentLevel = action.payload.indentLevel;
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
export const selectTasks = (state: RootState) => state.taskList.tasks;
export const selectTitle = (state: RootState) => state.taskList.title;

export const {
  setTaskList,
  setSyncStatus,
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
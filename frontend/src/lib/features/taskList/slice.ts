import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskSchema } from "./schema";
import { localStorageConfig } from "@/config/localStorage";
import * as z from "zod";

export const TaskListStateSchema = z.object({
  title: z.string(),
  tasks: z.array(TaskSchema),
});

export type TaskListState = z.infer<typeof TaskListStateSchema>;

export const loadTaskListState = (): TaskListState | undefined => {
  try {
    const state = localStorage.getItem(localStorageConfig.taskListKey);
    if (!state) return undefined;
    return TaskListStateSchema.parse(JSON.parse(state));
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export const saveTaskListState = (state: TaskListState | undefined) => {
  try {
    localStorage.setItem(localStorageConfig.taskListKey, JSON.stringify(state));
  } catch (err) {
    console.error(err);
  }
}

const initialState: TaskListState = {
  title: "",
  tasks: [],
};

export const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    load: () => {
      const persistedState = loadTaskListState();
      console.log("hi");
      if (!persistedState) return;
      console.log("hi", persistedState);
      return persistedState;
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

export const selectTasks = (state: RootState) => state.taskList.tasks;
export const selectTitle = (state: RootState) => state.taskList.title;

export const {
  load,
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
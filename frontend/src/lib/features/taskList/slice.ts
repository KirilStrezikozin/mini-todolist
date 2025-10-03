import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "./schema";

export interface TaskListState {
  title: string,
  tasks: Task[],
};

const initialState: TaskListState = {
  title: "",
  tasks: [],
};

export const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<number>) => {
      state.tasks.splice(action.payload, 1);
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
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

export const {
  addTask,
  removeTask,
  setTasks,
  changeTitle,
  changeTaskCompleted,
  changeTaskPriority,
  changeTaskName,
  changeTaskIndentLevel
} = taskListSlice.actions;

export default taskListSlice.reducer;
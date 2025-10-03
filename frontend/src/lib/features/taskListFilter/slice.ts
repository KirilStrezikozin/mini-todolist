import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TaskListFilterState {
  search: string,
  completion: "done" | "undone" | "all",
  priority: "asc" | "desc" | "none",
};

const initialState: TaskListFilterState = {
  search: "",
  completion: "all",
  priority: "none",
};

export const taskListFilterSlice = createSlice({
  name: "taskListFilter",
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<TaskListFilterState["search"]>) => {
      state.search = action.payload;
    },
    setCompletionFilter: (state, action: PayloadAction<TaskListFilterState["completion"]>) => {
      state.completion = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<TaskListFilterState["priority"]>) => {
      state.priority = action.payload;
    },
  },
});

export const {
  setSearchFilter,
  setCompletionFilter,
  setPriorityFilter,
} = taskListFilterSlice.actions;

export default taskListFilterSlice.reducer;
import { RootState } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ErrorState {
  message?: string,
};

const initialState: ErrorState = {};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const { setError } = errorSlice.actions;

export const selectErrorMessage = (state: RootState) => state.error.message;

export default errorSlice.reducer;
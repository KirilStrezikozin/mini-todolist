import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isActionType<
  T extends ActionCreatorWithPayload<any>
>(action: unknown, reducer: T): action is ReturnType<T> {
  return typeof action === "object" && action != null && (action as any).type === reducer.type;
}
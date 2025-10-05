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

export function dateWithoutTimezone(date: Date): string {
  /* Get offset in milliseconds, subtract from date, and remove trailing Z. */
  const tzoffset = date.getTimezoneOffset() * 60000;
  const withoutTimezone = new Date(date.valueOf() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return withoutTimezone;
}
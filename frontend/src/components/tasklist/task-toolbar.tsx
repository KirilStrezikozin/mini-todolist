import React, { RefObject, useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Trash2,
  ArrowUp,
  ArrowDown,
  ListIndentDecrease,
  ListIndentIncrease,
} from "lucide-react";

import { TaskSchema } from "@/lib/features/taskList/schema";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changeTaskIndentLevel, changeTaskPriority, moveTaskDown, moveTaskUp, removeTask } from "@/lib/features/taskList/slice";
import { cn } from "@/lib/utils";

interface TaskToolbarProps {
  inputRef?: RefObject<HTMLTextAreaElement | null> | null,
  taskIndex: number,
};

export function TaskToolbar({ taskIndex, inputRef }: TaskToolbarProps) {
  const dispatch = useAppDispatch();

  const task = useAppSelector(state => state.taskList.tasks[taskIndex]);

  const minPriority = TaskSchema.def.shape.priority.minValue ?? 0;
  const maxPriority = TaskSchema.def.shape.priority.maxValue ?? 0;

  const restoreFocus = useCallback(() => {
    inputRef?.current?.focus();
  }, [inputRef])

  return (
    <div onClick={restoreFocus} onFocus={restoreFocus} className="fixed bottom-8 bg-background flex items-stretch space-x-1 rounded-lg border p-1 shadow-xs max-w-4/5 sm:max-w-full scrollbar-hidden overflow-x-auto">
      <div className="flex w-12">
        <Button variant="outline" onClick={() => dispatch(removeTask(taskIndex))} className="h-full shadow-none w-12">
          <Trash2 className="w-5 h-5 stroke-red-500" />
        </Button>
      </div>

      <div className="flex w-24">
        <Button variant="outline" onClick={() => dispatch(changeTaskIndentLevel({ index: taskIndex, indentLevel: 0 }))} className={cn("h-full rounded-r-none w-12 shadow-none", task.indentLevel === 0 ? "opacity-50" : "")}>
          <div className="flex flex-col items-center">
            <ListIndentDecrease className="w-5 h-5" />
            <span className="text-xs pt-2">Left</span>
          </div>
        </Button>
        <Button variant="outline" onClick={() => dispatch(changeTaskIndentLevel({ index: taskIndex, indentLevel: 1 }))} className={cn("h-full rounded-l-none w-12 shadow-none", task.indentLevel === 1 ? "opacity-50" : "")}>
          <div className="flex flex-col items-center">
            <ListIndentIncrease className="w-5 h-5" />
            <span className="text-xs pt-2">Right</span>
          </div>
        </Button>
      </div>

      <div className="flex">
        <Button variant="outline" className={cn("shadow-none rounded-r-none h-full w-4", task.priority === minPriority ? "opacity-50" : "")} onClick={() => {
          if (task.priority > minPriority) {
            dispatch(changeTaskPriority({ index: taskIndex, priority: task.priority - 1 }))
          }
        }}>
          -
        </Button>
        <Button variant="outline" className="flex-col h-full disabled:opacity-100 rounded-none hover:bg-background hover:text-primary dark:hover:bg-input/30 w-16">
          <span className="text-center">{task.priority}</span>
          <span className="px-4 text-xs text-center">Priority</span>
        </Button>
        <Button variant="outline" className={cn("shadow-none rounded-l-none h-full w-4", task.priority === maxPriority ? "opacity-50" : "")} onClick={() => {
          if (task.priority < maxPriority) {
            dispatch(changeTaskPriority({ index: taskIndex, priority: task.priority + 1 }))
          }
        }}>
          +
        </Button>
      </div>

      <div className="flex w-24">
        <Button aria-label="Move item down" variant="outline" className="h-full rounded-r-none w-12 shadow-none" onClick={() => dispatch(moveTaskUp(taskIndex))}>
          <div className="flex flex-col items-center">
            <ArrowUp className="w-5 h-5" />
            <span className="text-xs pt-2">Up</span>
          </div>
        </Button>
        <Button aria-label="Move item up" variant="outline" className="h-full rounded-l-none w-12" onClick={() => dispatch(moveTaskDown(taskIndex))}>
          <div className="flex flex-col items-center">
            <ArrowDown className="w-5 h-5" />
            <span className="text-xs pt-2">Down</span>
          </div>
        </Button>
      </div>
    </div >
  );
}
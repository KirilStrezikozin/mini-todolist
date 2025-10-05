"use client"

import { StrictMode, useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "motion/react";

import { taskListConfig } from "@/config/taskList";

import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector, useAppStore } from "@/hooks/redux";
import { addTask, getNextTaskKey, selectTaskList, selectTasks, setTaskList, taskListSlice } from "@/lib/features/taskList/slice";
import { selectCompletionFilter, selectPriorityFilter, selectSearchFilter } from "@/lib/features/taskListFilter/slice";
import { loadLocalTaskListState, putTaskListDB, saveLocalTaskListState, schedulePutTaskListDB } from "@/lib/features/taskList/sync";
import { selectLastActionType } from "@/lib/store";

import { Task } from "./task";
import { Collapse } from "../collapse";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export function TaskList() {
  const session = useSession();

  const store = useAppStore();

  useEffect(() => {
    /* Load persisted task list state on mount. */
    store.dispatch(setTaskList(loadLocalTaskListState()));
    store.subscribe(() => {
      saveLocalTaskListState(store.getState().taskList);
      dispatch(schedulePutTaskListDB()); /* Periodically sync state to DB. */
    });
  }, []);

  const dispatch = useAppDispatch();

  const taskList = useAppSelector(selectTaskList);
  const tasks = useAppSelector(selectTasks);
  const lastActionType = useAppSelector(selectLastActionType);

  const searchFilter = useAppSelector(selectSearchFilter);
  const completionFilter = useAppSelector(selectCompletionFilter);
  const priorityFilter = useAppSelector(selectPriorityFilter);

  const lastTaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Sync task list with DB when logged-in. */
    if (session.status === "authenticated") {
      /* This action will try pushing local task list state to DB first.
       * In case the local state is outdated, the action will fetch the state
       * from DB and load it. */
      dispatch(putTaskListDB({
        title: taskList.title,
        updated_at: taskList.updated_at,
        tasks: taskList.tasks,
      }));
    }
  }, [session])

  useEffect(() => {
    /* Focus the text area of the last task once a new one has been added. */
    if (lastActionType !== taskListSlice.actions.addTask.type) return;
    interface Focusable extends HTMLElement { focus: () => void }
    (lastTaskRef.current?.lastChild as Focusable).focus();
  }, [lastActionType])

  const tasksComponent = useMemo(() => {
    let sortedTasks = tasks;
    if (priorityFilter !== "none") {
      sortedTasks = tasks.toSorted((a, b) => {
        if (priorityFilter === "asc") return a.priority - b.priority;
        else return b.priority - a.priority;
      });
    }

    return (
      <div key={0} className="flex flex-col w-full">
        {sortedTasks.map((task, index) => {
          if (!task.name.includes(searchFilter)) return;
          else if (completionFilter === "done" && !task.completed) return;
          else if (completionFilter === "undone" && task.completed) return;
          return (
            <Task
              key={task.key}
              index={index}
              data={task}
              inputRef={index === tasks.length - 1 ? lastTaskRef : null}
            />
          );
        })}
      </div>
    );
  }, [searchFilter, completionFilter, priorityFilter, tasks]);

  return (
    <StrictMode>
      <AnimatePresence>
        <div className="flex flex-col w-full">
          {tasksComponent}
          <Collapse
            /* Avoid adding multiple sentinel tasks elements. */
            show={!Boolean(tasks.length) || Boolean(tasks[tasks.length - 1].name)}
            key={1}
            layout
          >
            <Button
              variant="outline"
              className="opacity-50 shadow-none border-none bg-transparent dark:bg-transparent h-7 w-full text-muted-foreground hover:opacity-100 text-sm w-full"
              onClick={_ => {
                dispatch(addTask({
                  ...taskListConfig.defaultTask,
                  /* Guarantee a unique key for each new task element. */
                  key: getNextTaskKey(tasks),
                }));
              }}
            >
              <Plus /> Add
            </Button>
          </Collapse>
        </div>
      </AnimatePresence>
    </StrictMode >
  );
}
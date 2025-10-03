"use client"

import { TaskListHeader } from "@/components/tasklist/header";
import { TaskToolbar } from "@/components/tasklist/task-toolbar";
import { TextInput } from "@/components/text-input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { RefObject, StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector, useAppStore } from "@/hooks/redux";
import { addTask, changeTaskCompleted, changeTaskName, getNextTaskKey, load, saveTaskListState, taskListSlice } from "@/lib/features/taskList/slice";
import { type Task } from "@/lib/features/taskList/schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { taskListConfig } from "@/config/taskList";
import { selectLastActionType } from "@/lib/store";
import { Collapse } from "@/components/collapse";
import { AnimatePresence } from "motion/react";
import { useMounted } from "@/hooks/use-mounted";

const tasksbackup = [
  {
    key: 0,
    name: "Microcontrollers at Saxion 8:30-12:30 and several other things",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    key: 1,
    name: "Gym 13-15",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    key: 2,
    name: "Lidl:",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    key: 3,
    name: "Gehakt",
    completed: true,
    indentLevel: 1,
    priority: 0,
  },
  {
    key: 4,
    name: "Brood",
    completed: true,
    indentLevel: 1,
    priority: 0,
  },
  {
    key: 5,
    name: "Sperziebonen",
    completed: true,
    indentLevel: 1,
    priority: 0,
  },
  {
    key: 6,
    name: "Lunch",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    key: 7,
    name: "Make holes in Amina's slippers",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    key: 8,
    name: "Reply to BakeMaster clients",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    key: 9,
    name: "Update and upload CVs",
    completed: false,
    indentLevel: 0,
    priority: 0,
  },
  {
    key: 10,
    name: "Practice databases",
    completed: false,
    indentLevel: 0,
    priority: 0,
  },
  {
    key: 11,
    name: "Home groups presentation",
    completed: false,
    indentLevel: 0,
    priority: 0,
  }
];

interface TaskProps {
  index: number,
  data: Task,
  inputRef?: RefObject<HTMLDivElement | null> | null,
};

function Task({ index, data, inputRef }: TaskProps) {
  const dispatch = useAppDispatch();

  const ref = useRef<HTMLTextAreaElement>(null);
  const [show, setShow] = useState(false);

  return (
    <>
      <Collapse key={data.key} layout>
        <div ref={inputRef} className={cn(
          "flex has-[[aria-checked=true]]:line-through has-[[aria-checked=true]]:text-muted-foreground transition-all",
          data.indentLevel == 0 ? "pl-0" : "pl-6",
        )}>
          <div className="flex py-2">
            <Checkbox
              defaultChecked={data.completed}
              className={data.indentLevel == 0 ? "" : "rounded-lg"}
              onCheckedChange={state => dispatch(
                changeTaskCompleted({ index: index, completed: state === true ? true : false })
              )}
            />
          </div>
          <TextInput
            inputRef={ref}
            onFocus={_ => setShow(true)}
            onBlur={e => {
              /* Skip updating state in store on no changes to the task name. */
              if (data.name !== e.target.value || !e.target.value) {
                dispatch(changeTaskName({ index: index, name: e.target.value }));
              }
              setShow(false);
            }}
            defaultValue={data.name}
          />
        </div>
      </Collapse>
      <Collapse show={show && Boolean(data.name)}>
        <div className="absolute flex left-0 flex-col items-center w-full">
          <TaskToolbar taskIndex={index} inputRef={ref} />
        </div>
      </Collapse>
    </>
  );

}

function TaskList() {
  const store = useAppStore();
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
    store.dispatch(load());
    store.subscribe(() => {
      console.log("writing");
      saveTaskListState(store.getState().taskList);
    });
  }

  const dispatch = useAppDispatch();

  const tasks = useAppSelector(state => state.taskList.tasks);
  const lastActionType = useAppSelector(selectLastActionType);

  const searchFilter = useAppSelector(state => state.taskListFilter.search);
  const completionFilter = useAppSelector(state => state.taskListFilter.completion);
  const priorityFilter = useAppSelector(state => state.taskListFilter.priority);

  const lastTaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Focus the text area of the last task once a new one has been added. */
    if (lastActionType !== taskListSlice.actions.addTask.type) return;
    interface Focusable extends HTMLElement { focus: () => void }
    (lastTaskRef.current?.lastChild as Focusable).focus();
  }, [lastActionType])

  const mounted = useMounted();

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

  return mounted ? (
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
  ) : null;
}

export default function Page() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-start">
        <TaskListHeader />
        <TaskList />
      </main>
    </div >
  );
}
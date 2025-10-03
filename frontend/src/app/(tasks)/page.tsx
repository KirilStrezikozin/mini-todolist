"use client"

import { TaskListTitle } from "@/components/tasklist/title";
import { TaskToolbar } from "@/components/tasklist/task-toolbar";
import { TextInput } from "@/components/text-input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Dispatch, RefObject, SetStateAction, StrictMode, useCallback, useEffect, useRef, useState, FocusEvent } from "react";
import { useAppDispatch, useAppSelector, useAppStore } from "@/hooks/redux";
import { addTask, changeTaskCompleted, changeTaskName, setTasks, taskListSlice } from "@/lib/features/taskList/slice";
import { type Task } from "@/lib/features/taskList/schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { taskListConfig } from "@/config/taskList";
import { selectLastActionType } from "@/lib/store";
import { Collapse } from "@/components/collapse";
import { AnimatePresence } from "motion/react";

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
      <div className="absolute">
        <Collapse show={show && Boolean(data.name)}>
          <TaskToolbar taskIndex={index} inputRef={ref} />
        </Collapse>
      </div>
    </>
  );

}

function TaskList() {
  // TODO: do not init store here.
  const store = useAppStore();
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
    store.dispatch(setTasks(tasksbackup));
  }

  const dispatch = useAppDispatch();

  const tasks = useAppSelector(state => state.taskList.tasks);
  const lastActionType = useAppSelector(selectLastActionType);

  const lastTaskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Focus the text area of the last task once a new one has been added. */
    if (lastActionType !== taskListSlice.actions.addTask.type) return;
    interface Focusable extends HTMLElement { focus: () => void }
    (lastTaskRef.current?.lastChild as Focusable).focus();
  }, [lastActionType])

  return (
    <StrictMode>
      <AnimatePresence>
        <div className="flex flex-col w-full">
          <div key={0} className="flex flex-col w-full">
            {tasks.map((task, index) => (
              <Task
                key={task.key}
                index={index}
                data={task}
                inputRef={index === tasks.length - 1 ? lastTaskRef : null}
              />
            ))}
          </div>
          <Collapse
            /* Avoid adding multiple sentinel tasks elements. */
            show={Boolean(tasks[tasks.length - 1].name)}
            key={1}
            layout
          >
            <Button
              variant="outline"
              className="opacity-50 shadow-none border-none bg-transparent dark:bg-transparent h-7 w-full text-muted-foreground text-sm w-full"
              onClick={_ => {
                dispatch(addTask({
                  ...taskListConfig.defaultTask,
                  /* Guarantee a unique key for each new task element. */
                  key: tasks[tasks.length - 1].key + 1,
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

export default function Page() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-start">
        <TaskListTitle />
        <TaskList />
      </main>
    </div >
  );
}
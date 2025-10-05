import { RefObject, useRef, useState } from "react";

import { Collapse } from "../collapse";
import { Checkbox } from "../ui/checkbox";
import { TextInput } from "../text-input";
import { TaskToolbar } from "./task-toolbar";

import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/hooks/redux";
import { changeTaskCompleted, changeTaskName } from "@/lib/features/taskList/slice";
import { type Task } from "@/lib/features/taskList/schema";

interface TaskProps {
  index: number,
  data: Task,
  inputRef?: RefObject<HTMLDivElement | null> | null,
};

export function Task({ index, data, inputRef }: TaskProps) {
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
            onFocus={() => setShow(true)}
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
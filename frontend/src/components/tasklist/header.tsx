"use client"

import { useRef, useState } from "react";

import { taskListConfig } from "@/config/taskList";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changeTitle, selectTitle } from "@/lib/features/taskList/slice";
import { selectSearchFilter, setSearchFilter } from "@/lib/features/taskListFilter/slice";

import { TextInput } from "../text-input";
import { TaskListOptions } from "./options";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function TaskListHeader() {
  const dispatch = useAppDispatch();

  const title = useAppSelector(selectTitle);
  const searchFilter = useAppSelector(selectSearchFilter);

  const searchRef = useRef<HTMLInputElement>(null);
  const [showSearch, setShowSearch] = useState<Checked>(false);

  return (
    <div className="flex flex-1 flex-col border-b py-2 w-full">
      <div className="flex flex-1 w-full">
        <TextInput
          className="min-h-(--text-5xl) placeholder:text-4xl text-4xl file:text-4xl md:text-4xl"
          placeholder={taskListConfig.defaultTitle}
          onBlur={e => {
            /* Skip updating state in store on no changes to the title. */
            if (title !== e.target.value) {
              dispatch(changeTitle(e.target.value));
            }
          }}
          defaultValue={title}
        />
        <TaskListOptions showSearch={showSearch} setShowSearch={setShowSearch} />
      </div>
      {showSearch &&
        <div className="py-2">
          <InputGroup>
            <InputGroupInput
              ref={searchRef}
              onInput={e => dispatch(setSearchFilter(e.currentTarget.value))}
              placeholder="Search..."
              defaultValue={searchFilter}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Button
                variant="ghost"
                className="hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                  dispatch(setSearchFilter(""));
                  if (searchRef.current) searchRef.current.value = "";
                }}
              >
                <X />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
      }
    </div>
  );
}
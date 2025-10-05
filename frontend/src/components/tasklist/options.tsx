"use client"

import { Dispatch, SetStateAction } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";

import { EllipsisVertical } from "lucide-react";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectCompletionFilter, selectPriorityFilter, setCompletionFilter, setPriorityFilter } from "@/lib/features/taskListFilter/slice";

interface TaskListOptions {
  showSearch?: CheckedState,
  setShowSearch: Dispatch<SetStateAction<CheckedState | undefined>>,
};

export function TaskListOptions({ showSearch, setShowSearch }: TaskListOptions) {
  const dispatch = useAppDispatch();

  const completionFilter = useAppSelector(selectCompletionFilter);
  const priorityFilter = useAppSelector(selectPriorityFilter);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="font-medium">Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            checked={showSearch}
            onCheckedChange={setShowSearch}
          >
            Show Search
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Filter</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={completionFilter === "done"}
            onCheckedChange={(value) => {
              dispatch(setCompletionFilter(value ? "done" : "all"));
            }}
          >
            Done
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={completionFilter === "undone"}
            onCheckedChange={(value) => {
              dispatch(setCompletionFilter(value ? "undone" : "all"));
            }}
          >
            Undone
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort by Priority</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={priorityFilter === "asc"}
            onCheckedChange={(value) => {
              dispatch(setPriorityFilter(value ? "asc" : "none"));
            }}
          >
            Ascending
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={priorityFilter === "desc"}
            onCheckedChange={(value) => {
              dispatch(setPriorityFilter(value ? "desc" : "none"));
            }}
          >
            Descending
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
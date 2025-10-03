"use client"

import { TaskListHeader } from "@/components/tasklist/header";
import { TaskList } from "@/components/tasklist/task-list";

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
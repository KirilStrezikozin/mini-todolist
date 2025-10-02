import { taskListConfig } from "@/config/taskList";
import { TextInput } from "../text-input";

export function TaskListTitle() {
  return (
    <div className="flex flex-1 border-b py-2 w-full">
      <TextInput
        className="min-h-(--text-5xl) placeholder:text-4xl text-4xl file:text-4xl md:text-4xl"
        placeholder={taskListConfig.defaultTitle}
      />
    </div>
  );
}
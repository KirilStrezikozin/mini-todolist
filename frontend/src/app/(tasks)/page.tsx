import { TaskListTitle } from "@/components/tasklist/title";
import { Input } from "@/components/ui/input";
import { TextInput } from "@/components/text-input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const tasks = [
  {
    name: "Microcontrollers at Saxion 8:30-12:30 and several other things",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    name: "Gym 13-15",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    name: "Lidl:",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    name: "Gehakt",
    completed: true,
    indentLevel: 1,
    priority: 0,
  },
  {
    name: "Brood",
    completed: true,
    indentLevel: 1,
    priority: 0,
  },
  {
    name: "Sperziebonen",
    completed: true,
    indentLevel: 1,
    priority: 0,
  },
  {
    name: "Lunch",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    name: "Make holes in Amina's slippers",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    name: "Reply to BakeMaster clients",
    completed: true,
    indentLevel: 0,
    priority: 0,
  },
  {
    name: "Update and upload CVs",
    completed: false,
    indentLevel: 0,
    priority: 0,
  },
  {
    name: "Practice databases",
    completed: false,
    indentLevel: 0,
    priority: 0,
  },
  {
    name: "Home groups presentation",
    completed: false,
    indentLevel: 0,
    priority: 0,
  }
] as const;

function TaskList() {
  return (
    <div className="flex flex-col w-full">
      {tasks.map((task, index) => (
        <div key={index} className={cn(
          "flex has-[[aria-checked=true]]:line-through has-[[aria-checked=true]]:text-muted-foreground",
          task.indentLevel == 0 ? "pl-0" : "pl-6",
        )}>
          <div className="flex py-2">
            <Checkbox className={task.indentLevel == 0 ? "" : "rounded-lg"} />
          </div>
          <TextInput defaultValue={task.name} />
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 sm:items-start">
        <TaskListTitle />
        <TaskList />
        <Input type="text" placeholder="Insert" />
      </main>
    </div>
  );
}
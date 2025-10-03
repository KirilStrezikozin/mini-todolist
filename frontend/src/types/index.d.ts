import { Task } from "@/lib/features/taskList/schema";

export type SiteConfig = {
  name: string,
  description: string,
  url: string,
  links: {
    github: string,
  },
};

export type TaskListConfig = {
  defaultTitle: string,
  defaultTask: Omit<Task, "key">,
};

export type LocalStorageConfig = {
  taskListKey: string,
};
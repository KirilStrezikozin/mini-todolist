import * as z from "zod";

/**
 * Schema of a task in a to-do list.
 */
export const TaskSchema = z.object({
  key: z.int(),
  name: z.string(),
  completed: z.boolean(),
  indentLevel: z.int().gte(0).lte(1),
  priority: z.int().gte(0).lte(10),
});

export type Task = z.infer<typeof TaskSchema>;

export const TaskListStateSchema = z.object({
  title: z.string(),
  updated_at: z.iso.datetime({ local: true }), /* timezone-naive. */
  tasks: z.array(TaskSchema),
  syncStatus: z.literal(["idle", "pulling", "pushing"]),
  syncScheduled: z.boolean(),
  dirty: z.boolean(),
});

export type TaskListState = z.infer<typeof TaskListStateSchema>;

export const TaskListPublicDBSchema = z.object({
  title: z.string(),
  id: z.uuid(),
  user_id: z.uuid(),
  updated_at: z.iso.datetime({ local: true }), /* timezone-naive. */
  tasks: z.array(TaskSchema),
});


export type TaskListPublicDB = z.infer<typeof TaskListPublicDBSchema>;


export const TaskListUpdateDBSchema = TaskListPublicDBSchema.pick({
  title: true, tasks: true, updated_at: true
});

export type TaskListUpdateDB = z.infer<typeof TaskListUpdateDBSchema>;
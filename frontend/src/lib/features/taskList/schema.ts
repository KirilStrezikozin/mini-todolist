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
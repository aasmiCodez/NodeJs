import { z } from "zod";

const getTasksSchema = z.object({
  filter: z.enum(["completed", "pending"]).optional(),
});

export default { getTasksSchema };

import { z } from "zod";

const importChatSchema = z.object({
  file: z
    .instanceof(Buffer, { message: "Invalid file format" })
    .refine((file) => file.byteLength > 0, { message: "File cannot be empty" }),
});

export default { importChatSchema };

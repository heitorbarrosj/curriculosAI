import { z } from "zod";

export const chatSchema = z.object({
  body: z.object({
    chatId: z.string().optional(),
    resumeId: z.string().optional(),
    jobId: z.string().optional(),
    message: z.string().min(2).max(4000)
  })
});

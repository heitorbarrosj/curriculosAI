import { z } from "zod";

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(160),
    company: z.string().max(160).optional(),
    description: z.string().min(80)
  })
});

export const matchJobSchema = z.object({
  params: z.object({
    jobId: z.string().min(1),
    resumeId: z.string().min(1)
  })
});

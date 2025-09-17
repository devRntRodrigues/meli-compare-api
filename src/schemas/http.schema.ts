import z from 'zod';

export type SuccessResponseBody<T> = {
  message: string;
  data: T;
  timestamp: string;
};

export const createSuccessResponseBodySchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    message: z.string(),
    data: dataSchema,
    timestamp: z.date(),
  });

export const errorResponseBodySchema = z.object({
  message: z.string(),
  code: z.number(),
  timestamp: z.string(),
  stack: z.string().optional(),
  issues: z
    .array(
      z.object({
        code: z.string(),
        message: z.string(),
        path: z.array(z.union([z.string(), z.number()])),
      })
    )
    .optional(),
});

export type ErrorResponseBody = z.infer<typeof errorResponseBodySchema>;

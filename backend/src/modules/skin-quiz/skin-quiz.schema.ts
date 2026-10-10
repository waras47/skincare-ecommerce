import { z } from "zod";

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        optionId: z.string(),
      }),
    )
    .min(1),
});

export const createQuestionSchema = z.object({
  orderNo: z.coerce.number().int().min(1),
  text: z.string().min(3),
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const createOptionSchema = z.object({
  text: z.string().min(1),
  skinTypeValue: z.string().min(1),
});

export const updateOptionSchema = createOptionSchema.partial();

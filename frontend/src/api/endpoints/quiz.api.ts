import { client, safeRequest } from "../client";
import type { QuizResult, SkinQuizQuestion } from "@/types";

export const quizApi = {
  listQuestions: () => safeRequest<SkinQuizQuestion[]>(() => client.get("/skin-quiz")),

  submit: (answers: { questionId: string; optionId: string }[]) =>
    safeRequest<QuizResult>(() => client.post("/skin-quiz/submit", { answers })),

  // admin
  createQuestion: (data: { orderNo: number; text: string }) =>
    safeRequest(() => client.post("/admin/skin-quiz/questions", data)),
  updateQuestion: (id: string, data: Partial<{ orderNo: number; text: string }>) =>
    safeRequest(() => client.patch(`/admin/skin-quiz/questions/${id}`, data)),
  deleteQuestion: (id: string) => safeRequest<null>(() => client.delete(`/admin/skin-quiz/questions/${id}`)),
  createOption: (questionId: string, data: { text: string; skinTypeValue: string }) =>
    safeRequest(() => client.post(`/admin/skin-quiz/questions/${questionId}/options`, data)),
  deleteOption: (id: string) => safeRequest<null>(() => client.delete(`/admin/skin-quiz/options/${id}`)),
};

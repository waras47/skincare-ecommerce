import { defineStore } from "pinia";
import { ref } from "vue";
import { quizApi } from "@/api/endpoints/quiz.api";
import type { QuizResult, SkinQuizQuestion } from "@/types";

export const useQuizStore = defineStore("quiz", () => {
  const questions = ref<SkinQuizQuestion[]>([]);
  const result = ref<QuizResult | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchQuestions() {
    isLoading.value = true;
    const res = await quizApi.listQuestions();
    isLoading.value = false;
    if (res.ok) questions.value = res.data;
    else error.value = res.error;
  }

  async function submit(answers: { questionId: string; optionId: string }[]): Promise<boolean> {
    isLoading.value = true;
    const res = await quizApi.submit(answers);
    isLoading.value = false;
    if (res.ok) {
      result.value = res.data;
      return true;
    }
    error.value = res.error;
    return false;
  }

  return { questions, result, isLoading, error, fetchQuestions, submit };
});

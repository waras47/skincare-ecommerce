<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { useQuizStore } from "@/stores/quiz.store";
import { useAuthStore } from "@/stores/auth.store";
import ProductCard from "@/components/product/ProductCard.vue";

const quizStore = useQuizStore();
const auth = useAuthStore();

const answers = reactive<Record<string, string>>({});

onMounted(() => quizStore.fetchQuestions());

const allAnswered = computed(
  () => quizStore.questions.length > 0 && quizStore.questions.every((q) => answers[q.id]),
);

async function onSubmit() {
  const payload = Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId }));
  const ok = await quizStore.submit(payload);
  if (ok && auth.isLoggedIn && quizStore.result) {
    auth.setUser({ ...auth.user!, skinType: quizStore.result.skinType });
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-xl font-semibold mb-6">Skin Quiz</h1>

    <div v-if="!quizStore.result" class="space-y-6">
      <div v-for="(question, idx) in quizStore.questions" :key="question.id" class="bg-white rounded-lg p-4 shadow-sm">
        <p class="font-medium mb-3">{{ idx + 1 }}. {{ question.text }}</p>
        <div class="flex flex-col gap-2">
          <label v-for="option in question.options" :key="option.id" class="flex items-center gap-2 text-sm">
            <input v-model="answers[question.id]" type="radio" :name="question.id" :value="option.id" />
            {{ option.text }}
          </label>
        </div>
      </div>

      <button
        :disabled="!allAnswered || quizStore.isLoading"
        class="w-full bg-rose-600 text-white rounded py-3 font-medium disabled:opacity-50"
        @click="onSubmit"
      >
        {{ quizStore.isLoading ? "Memproses..." : "Lihat Hasil" }}
      </button>
    </div>

    <div v-else class="text-center">
      <p class="text-gray-500">Jenis kulitmu:</p>
      <p class="text-2xl font-bold text-rose-600 capitalize mb-6">{{ quizStore.result.skinType }}</p>

      <h2 class="text-left font-medium mb-3">Rekomendasi produk</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <ProductCard v-for="product in quizStore.result.recommendations" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

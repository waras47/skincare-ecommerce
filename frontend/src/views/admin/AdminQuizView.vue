<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { quizApi } from "@/api/endpoints/quiz.api";
import type { SkinQuizQuestion } from "@/types";

const questions = ref<SkinQuizQuestion[]>([]);
const error = ref<string | null>(null);

const questionForm = reactive({ orderNo: 1, text: "" });
const optionForm = reactive({ questionId: "", text: "", skinTypeValue: "" });

async function load() {
  const res = await quizApi.listQuestions();
  if (res.ok) questions.value = res.data;
}
onMounted(load);

async function addQuestion() {
  const res = await quizApi.createQuestion({ orderNo: Number(questionForm.orderNo), text: questionForm.text });
  if (res.ok) {
    questionForm.text = "";
    load();
  } else {
    error.value = res.error;
  }
}

async function removeQuestion(id: string) {
  const res = await quizApi.deleteQuestion(id);
  if (res.ok) load();
  else error.value = res.error;
}

function openOptionForm(questionId: string) {
  optionForm.questionId = questionId;
  optionForm.text = "";
  optionForm.skinTypeValue = "";
}

async function addOption() {
  const res = await quizApi.createOption(optionForm.questionId, {
    text: optionForm.text,
    skinTypeValue: optionForm.skinTypeValue,
  });
  if (res.ok) {
    optionForm.questionId = "";
    load();
  } else {
    error.value = res.error;
  }
}

async function removeOption(id: string) {
  const res = await quizApi.deleteOption(id);
  if (res.ok) load();
  else error.value = res.error;
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold mb-6">Skin Quiz</h1>

    <form class="bg-white rounded-lg p-4 shadow-sm flex gap-3 items-end mb-6" @submit.prevent="addQuestion">
      <input v-model.number="questionForm.orderNo" type="number" placeholder="Urutan" required class="border rounded px-3 py-2 text-sm w-20" />
      <input v-model="questionForm.text" placeholder="Pertanyaan" required class="border rounded px-3 py-2 text-sm flex-1" />
      <button class="bg-rose-600 text-white rounded px-4 py-2 text-sm">Tambah Pertanyaan</button>
    </form>
    <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>

    <div v-for="q in questions" :key="q.id" class="bg-white rounded-lg p-4 shadow-sm mb-3">
      <div class="flex justify-between items-start">
        <p class="font-medium text-sm">{{ q.orderNo }}. {{ q.text }}</p>
        <button class="text-red-600 text-xs" @click="removeQuestion(q.id)">Hapus pertanyaan</button>
      </div>
      <ul class="mt-2 space-y-1">
        <li v-for="o in q.options" :key="o.id" class="flex justify-between text-sm text-gray-600">
          <span>{{ o.text }} &mdash; <em>{{ o.skinTypeValue }}</em></span>
          <button class="text-red-600 text-xs" @click="removeOption(o.id)">Hapus</button>
        </li>
      </ul>

      <button class="text-blue-600 text-xs mt-2" @click="openOptionForm(q.id)">+ opsi jawaban</button>
      <form v-if="optionForm.questionId === q.id" class="flex gap-2 items-end mt-2" @submit.prevent="addOption">
        <input v-model="optionForm.text" placeholder="Teks opsi" required class="border rounded px-2 py-1 text-xs flex-1" />
        <input v-model="optionForm.skinTypeValue" placeholder="Jenis kulit (kering/berminyak/...)" required class="border rounded px-2 py-1 text-xs" />
        <button class="bg-gray-800 text-white rounded px-3 py-1 text-xs">Simpan</button>
      </form>
    </div>
  </div>
</template>

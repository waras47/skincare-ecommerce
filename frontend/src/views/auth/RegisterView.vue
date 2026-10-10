<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();
const router = useRouter();

const form = reactive({ name: "", email: "", password: "" });
const isSubmitting = ref(false);

async function onSubmit() {
  isSubmitting.value = true;
  auth.error = null;
  const success = await auth.register(form);
  isSubmitting.value = false;
  if (success) router.push("/");
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <h1 class="text-xl font-semibold text-center">Daftar</h1>
    <p v-if="auth.error" class="text-sm text-red-600 bg-red-50 rounded p-2">{{ auth.error }}</p>

    <label class="flex flex-col gap-1 text-sm">
      Nama
      <input v-model="form.name" type="text" required class="border rounded px-3 py-2" />
    </label>
    <label class="flex flex-col gap-1 text-sm">
      Email
      <input v-model="form.email" type="email" required class="border rounded px-3 py-2" />
    </label>
    <label class="flex flex-col gap-1 text-sm">
      Password
      <input v-model="form.password" type="password" required minlength="6" class="border rounded px-3 py-2" />
    </label>

    <button type="submit" :disabled="isSubmitting" class="bg-rose-600 text-white rounded py-2 font-medium disabled:opacity-50">
      {{ isSubmitting ? "Memproses..." : "Daftar" }}
    </button>

    <p class="text-sm text-center text-gray-500">
      Sudah punya akun? <router-link to="/login" class="text-rose-600 underline">Masuk</router-link>
    </p>
  </form>
</template>

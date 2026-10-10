<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = reactive({ email: "", password: "" });
const isSubmitting = ref(false);

async function onSubmit() {
  isSubmitting.value = true;
  auth.error = null;
  const success = await auth.login(form);
  isSubmitting.value = false;
  if (success) {
    router.push((route.query.redirect as string) || "/");
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <h1 class="text-xl font-semibold text-center">Masuk</h1>
    <p v-if="auth.error" class="text-sm text-red-600 bg-red-50 rounded p-2">{{ auth.error }}</p>

    <label class="flex flex-col gap-1 text-sm">
      Email
      <input v-model="form.email" type="email" required class="border rounded px-3 py-2" />
    </label>
    <label class="flex flex-col gap-1 text-sm">
      Password
      <input v-model="form.password" type="password" required class="border rounded px-3 py-2" />
    </label>

    <button type="submit" :disabled="isSubmitting" class="bg-rose-600 text-white rounded py-2 font-medium disabled:opacity-50">
      {{ isSubmitting ? "Memproses..." : "Masuk" }}
    </button>

    <p class="text-sm text-center text-gray-500">
      Belum punya akun? <router-link to="/register" class="text-rose-600 underline">Daftar</router-link>
    </p>
    <p class="text-xs text-center text-gray-400">
      Demo: admin@skincare.test / Admin123! &middot; dinda@skincare.test / Customer123!
    </p>
  </form>
</template>

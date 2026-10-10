<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { catalogApi } from "@/api/endpoints/catalog.api";
import type { Category } from "@/types";

const categories = ref<Category[]>([]);
const form = reactive({ id: "", name: "", slug: "" });
const error = ref<string | null>(null);

async function load() {
  const res = await catalogApi.listCategories();
  if (res.ok) categories.value = res.data;
}
onMounted(load);

function edit(category: Category) {
  form.id = category.id;
  form.name = category.name;
  form.slug = category.slug;
}

function resetForm() {
  form.id = "";
  form.name = "";
  form.slug = "";
}

async function submit() {
  error.value = null;
  const res = form.id
    ? await catalogApi.updateCategory(form.id, { name: form.name, slug: form.slug })
    : await catalogApi.createCategory({ name: form.name, slug: form.slug });
  if (res.ok) {
    resetForm();
    load();
  } else {
    error.value = res.error;
  }
}

async function remove(id: string) {
  const res = await catalogApi.deleteCategory(id);
  if (res.ok) load();
  else error.value = res.error;
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold mb-6">Kategori</h1>

    <form class="bg-white rounded-lg p-4 shadow-sm flex gap-3 items-end mb-6" @submit.prevent="submit">
      <label class="flex flex-col gap-1 text-sm">
        Nama
        <input v-model="form.name" required class="border rounded px-3 py-2" />
      </label>
      <label class="flex flex-col gap-1 text-sm">
        Slug
        <input v-model="form.slug" required class="border rounded px-3 py-2" />
      </label>
      <button class="bg-rose-600 text-white rounded px-4 py-2 text-sm">{{ form.id ? "Update" : "Tambah" }}</button>
      <button v-if="form.id" type="button" class="text-sm text-gray-500" @click="resetForm">Batal</button>
    </form>
    <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>

    <table class="w-full bg-white rounded-lg shadow-sm text-sm">
      <thead>
        <tr class="text-left border-b">
          <th class="p-3">Nama</th>
          <th class="p-3">Slug</th>
          <th class="p-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in categories" :key="c.id" class="border-b last:border-0">
          <td class="p-3">{{ c.name }}</td>
          <td class="p-3">{{ c.slug }}</td>
          <td class="p-3 text-right space-x-2">
            <button class="text-blue-600" @click="edit(c)">Edit</button>
            <button class="text-red-600" @click="remove(c.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

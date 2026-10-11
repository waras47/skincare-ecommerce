<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { catalogApi } from "@/api/endpoints/catalog.api";
import type { Category } from "@/types";
import BaseModal from "@/components/ui/BaseModal.vue";

const categories = ref<Category[]>([]);
const form = reactive({ id: "", name: "", slug: "" });
const error = ref<string | null>(null);
const showModal = ref(false);

async function load() {
  const res = await catalogApi.listCategories();
  if (res.ok) categories.value = res.data;
}
onMounted(load);

function resetForm() {
  form.id = "";
  form.name = "";
  form.slug = "";
}

function openCreate() {
  resetForm();
  error.value = null;
  showModal.value = true;
}

function openEdit(category: Category) {
  form.id = category.id;
  form.name = category.name;
  form.slug = category.slug;
  error.value = null;
  showModal.value = true;
}

async function submit() {
  error.value = null;
  const res = form.id
    ? await catalogApi.updateCategory(form.id, { name: form.name, slug: form.slug })
    : await catalogApi.createCategory({ name: form.name, slug: form.slug });
  if (res.ok) {
    showModal.value = false;
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
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold">Kategori</h1>
      <button class="bg-brand-600 text-white rounded px-4 py-2 text-sm" @click="openCreate">+ Tambah Kategori</button>
    </div>

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
            <button class="text-blue-600" @click="openEdit(c)">Edit</button>
            <button class="text-red-600" @click="remove(c.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <BaseModal :show="showModal" :title="form.id ? 'Edit Kategori' : 'Tambah Kategori'" @close="showModal = false">
      <form class="flex flex-col gap-3" @submit.prevent="submit">
        <label class="flex flex-col gap-1 text-sm">
          Nama
          <input v-model="form.name" required class="border rounded px-3 py-2" />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          Slug
          <input v-model="form.slug" required class="border rounded px-3 py-2" />
        </label>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <div class="flex gap-2">
          <button class="bg-brand-600 text-white rounded px-4 py-2 text-sm">{{ form.id ? "Update" : "Tambah" }}</button>
          <button type="button" class="text-sm text-gray-500" @click="showModal = false">Batal</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

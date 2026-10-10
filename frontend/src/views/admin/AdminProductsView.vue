<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { catalogApi } from "@/api/endpoints/catalog.api";
import type { Category, Product } from "@/types";
import { formatRupiah } from "@/composables/format";

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const error = ref<string | null>(null);
const editingId = ref<string | null>(null);

const form = reactive({
  name: "",
  slug: "",
  categoryId: "",
  description: "",
  ingredients: "",
  skinTypes: "",
  basePrice: 0,
});

const variantForm = reactive({ productId: "", variantName: "", sku: "", price: 0, stock: 0 });
const imageForm = reactive({ productId: "", uploading: false });

async function load() {
  const [productsRes, categoriesRes] = await Promise.all([
    catalogApi.listProducts({ limit: 100 }),
    catalogApi.listCategories(),
  ]);
  if (productsRes.ok) products.value = productsRes.data.products;
  if (categoriesRes.ok) categories.value = categoriesRes.data;
}
onMounted(load);

function resetForm() {
  editingId.value = null;
  form.name = "";
  form.slug = "";
  form.categoryId = "";
  form.description = "";
  form.ingredients = "";
  form.skinTypes = "";
  form.basePrice = 0;
}

function edit(product: Product) {
  editingId.value = product.id;
  form.name = product.name;
  form.slug = product.slug;
  form.categoryId = product.categoryId;
  form.description = product.description;
  form.ingredients = product.ingredients;
  form.skinTypes = product.skinTypes.join(", ");
  form.basePrice = Number(product.basePrice);
}

async function submit() {
  error.value = null;
  const payload = {
    name: form.name,
    slug: form.slug,
    categoryId: form.categoryId,
    description: form.description,
    ingredients: form.ingredients,
    skinTypes: form.skinTypes.split(",").map((s) => s.trim()).filter(Boolean),
    basePrice: Number(form.basePrice),
  };
  const res = editingId.value
    ? await catalogApi.updateProduct(editingId.value, payload)
    : await catalogApi.createProduct(payload);
  if (res.ok) {
    resetForm();
    load();
  } else {
    error.value = res.error;
  }
}

async function remove(id: string) {
  const res = await catalogApi.deleteProduct(id);
  if (res.ok) load();
  else error.value = res.error;
}

function openVariantForm(productId: string) {
  variantForm.productId = productId;
  variantForm.variantName = "";
  variantForm.sku = "";
  variantForm.price = 0;
  variantForm.stock = 0;
}

async function addVariant() {
  const res = await catalogApi.addVariant(variantForm.productId, {
    variantName: variantForm.variantName,
    sku: variantForm.sku,
    price: Number(variantForm.price),
    stock: Number(variantForm.stock),
  });
  if (res.ok) {
    variantForm.productId = "";
    load();
  } else {
    error.value = res.error;
  }
}

function openImageForm(productId: string) {
  imageForm.productId = productId;
  imageForm.uploading = false;
}

async function uploadImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  imageForm.uploading = true;
  const res = await catalogApi.uploadImage(imageForm.productId, file, false);
  imageForm.uploading = false;
  (event.target as HTMLInputElement).value = "";

  if (res.ok) {
    load();
  } else {
    error.value = res.error;
  }
}

async function removeImage(id: string) {
  const res = await catalogApi.deleteImage(id);
  if (res.ok) load();
  else error.value = res.error;
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold mb-6">Produk</h1>

    <form class="bg-white rounded-lg p-4 shadow-sm grid grid-cols-2 gap-3 mb-6" @submit.prevent="submit">
      <input v-model="form.name" placeholder="Nama produk" required class="border rounded px-3 py-2 text-sm" />
      <input v-model="form.slug" placeholder="Slug" required class="border rounded px-3 py-2 text-sm" />
      <select v-model="form.categoryId" required class="border rounded px-3 py-2 text-sm">
        <option value="" disabled>Pilih kategori</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <input v-model.number="form.basePrice" type="number" placeholder="Harga dasar" required class="border rounded px-3 py-2 text-sm" />
      <input v-model="form.skinTypes" placeholder="Jenis kulit (pisah koma): kering, sensitif" class="border rounded px-3 py-2 text-sm col-span-2" />
      <textarea v-model="form.description" placeholder="Deskripsi" required class="border rounded px-3 py-2 text-sm col-span-2" />
      <textarea v-model="form.ingredients" placeholder="Ingredients" required class="border rounded px-3 py-2 text-sm col-span-2" />
      <div class="col-span-2 flex gap-2">
        <button class="bg-rose-600 text-white rounded px-4 py-2 text-sm">{{ editingId ? "Update" : "Tambah" }} Produk</button>
        <button v-if="editingId" type="button" class="text-sm text-gray-500" @click="resetForm">Batal</button>
      </div>
    </form>
    <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>

    <table class="w-full bg-white rounded-lg shadow-sm text-sm">
      <thead>
        <tr class="text-left border-b">
          <th class="p-3">Nama</th>
          <th class="p-3">Kategori</th>
          <th class="p-3">Harga</th>
          <th class="p-3">Varian</th>
          <th class="p-3"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="p in products" :key="p.id">
          <tr class="border-b">
            <td class="p-3">{{ p.name }}</td>
            <td class="p-3">{{ p.category?.name }}</td>
            <td class="p-3">{{ formatRupiah(Number(p.basePrice)) }}</td>
            <td class="p-3">
              <span v-for="v in p.variants" :key="v.id" class="inline-block mr-2 text-xs bg-gray-100 rounded px-2 py-0.5">
                {{ v.variantName }} ({{ v.stock }})
              </span>
              <button class="text-xs text-blue-600" @click="openVariantForm(p.id)">+ varian</button>
              <button class="text-xs text-blue-600 ml-2" @click="openImageForm(p.id)">+ gambar</button>
            </td>
            <td class="p-3 text-right space-x-2">
              <button class="text-blue-600" @click="edit(p)">Edit</button>
              <button class="text-red-600" @click="remove(p.id)">Hapus</button>
            </td>
          </tr>
          <tr v-if="variantForm.productId === p.id" class="border-b bg-gray-50">
            <td colspan="5" class="p-3">
              <form class="flex gap-2 items-end flex-wrap" @submit.prevent="addVariant">
                <input v-model="variantForm.variantName" placeholder="Nama varian" required class="border rounded px-2 py-1 text-xs" />
                <input v-model="variantForm.sku" placeholder="SKU" required class="border rounded px-2 py-1 text-xs" />
                <input v-model.number="variantForm.price" type="number" placeholder="Harga" required class="border rounded px-2 py-1 text-xs w-24" />
                <input v-model.number="variantForm.stock" type="number" placeholder="Stok" required class="border rounded px-2 py-1 text-xs w-20" />
                <button class="bg-gray-800 text-white rounded px-3 py-1 text-xs">Simpan</button>
              </form>
            </td>
          </tr>
          <tr v-if="imageForm.productId === p.id" class="border-b bg-gray-50">
            <td colspan="5" class="p-3">
              <div class="flex gap-2 flex-wrap mb-2">
                <div v-for="img in p.images" :key="img.id" class="relative">
                  <img :src="img.url" class="w-12 h-12 rounded object-cover" />
                  <button class="absolute -top-1 -right-1 bg-white rounded-full w-4 h-4 text-[10px] text-red-600 shadow" @click="removeImage(img.id)">✕</button>
                </div>
              </div>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" :disabled="imageForm.uploading" class="text-xs" @change="uploadImage" />
              <span v-if="imageForm.uploading" class="text-xs text-gray-400 ml-2">Mengunggah...</span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

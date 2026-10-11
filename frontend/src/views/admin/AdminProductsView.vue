<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { catalogApi } from "@/api/endpoints/catalog.api";
import { dashboardApi } from "@/api/endpoints/dashboard.api";
import type { Category, DashboardStats, Product } from "@/types";
import { formatRupiah } from "@/composables/format";
import BaseModal from "@/components/ui/BaseModal.vue";
import StatCard from "@/components/admin/StatCard.vue";
import ProductImage from "@/components/product/ProductImage.vue";

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const error = ref<string | null>(null);
const editingId = ref<string | null>(null);
const showModal = ref(false);
const stats = ref<DashboardStats | null>(null);

async function loadStats() {
  const res = await dashboardApi.getStats();
  if (res.ok) stats.value = res.data;
}

function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

// Products table has no "status" field in the schema — derive a 2-state
// badge from stock instead of inventing a fake draft/publish workflow.
function productStatus(product: Product): "available" | "out-of-stock" {
  return totalStock(product) > 0 ? "available" : "out-of-stock";
}

const search = ref("");
const statusFilter = ref<"all" | "available" | "out-of-stock">("all");

const filteredProducts = computed(() =>
  products.value.filter((p) => {
    const matchesSearch =
      !search.value ||
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      p.id.includes(search.value);
    const matchesStatus = statusFilter.value === "all" || productStatus(p) === statusFilter.value;
    return matchesSearch && matchesStatus;
  }),
);

const selectedIds = ref<Set<string>>(new Set());
const allSelected = computed(
  () => filteredProducts.value.length > 0 && filteredProducts.value.every((p) => selectedIds.value.has(p.id)),
);

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(filteredProducts.value.map((p) => p.id));
  }
}

function toggleSelect(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
}

function clearSelection() {
  selectedIds.value = new Set();
}

function exportCsv(ids: string[]) {
  const rows = products.value.filter((p) => ids.includes(p.id));
  const header = ["ID", "Nama", "Kategori", "Harga", "Stok", "Status"];
  const lines = rows.map((p) =>
    [p.id, p.name, p.category?.name ?? "", p.basePrice, totalStock(p), productStatus(p)]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `produk-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function bulkDelete() {
  for (const id of selectedIds.value) {
    await catalogApi.deleteProduct(id);
  }
  clearSelection();
  load();
}

const form = reactive({
  name: "",
  slug: "",
  categoryId: "",
  description: "",
  ingredients: "",
  skinTypes: "",
  basePrice: 0,
});

async function load() {
  const [productsRes, categoriesRes] = await Promise.all([
    catalogApi.listAllForAdmin(),
    catalogApi.listCategories(),
  ]);
  if (productsRes.ok) products.value = productsRes.data;
  if (categoriesRes.ok) categories.value = categoriesRes.data;
}
onMounted(() => {
  load();
  loadStats();
});

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

function openCreate() {
  resetForm();
  error.value = null;
  showModal.value = true;
}

function openEdit(product: Product) {
  editingId.value = product.id;
  form.name = product.name;
  form.slug = product.slug;
  form.categoryId = product.categoryId;
  form.description = product.description;
  form.ingredients = product.ingredients;
  form.skinTypes = product.skinTypes.join(", ");
  form.basePrice = Number(product.basePrice);
  error.value = null;
  showModal.value = true;
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
    showModal.value = false;
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

// Varian + gambar — satu modal "Kelola" per produk, menggantikan baris inline.
const manageProduct = ref<Product | null>(null);
const showManageModal = ref(false);
const manageError = ref<string | null>(null);
const variantForm = reactive({ variantName: "", sku: "", price: 0, stock: 0 });
const uploading = ref(false);

function openManage(product: Product) {
  manageProduct.value = product;
  manageError.value = null;
  variantForm.variantName = "";
  variantForm.sku = "";
  variantForm.price = 0;
  variantForm.stock = 0;
  showManageModal.value = true;
}

async function refreshManageProduct() {
  if (!manageProduct.value) return;
  await load();
  manageProduct.value = products.value.find((p) => p.id === manageProduct.value!.id) ?? null;
}

async function addVariant() {
  if (!manageProduct.value) return;
  const res = await catalogApi.addVariant(manageProduct.value.id, {
    variantName: variantForm.variantName,
    sku: variantForm.sku,
    price: Number(variantForm.price),
    stock: Number(variantForm.stock),
  });
  if (res.ok) {
    variantForm.variantName = "";
    variantForm.sku = "";
    variantForm.price = 0;
    variantForm.stock = 0;
    await refreshManageProduct();
  } else {
    manageError.value = res.error;
  }
}

async function removeVariant(id: string) {
  const res = await catalogApi.deleteVariant(id);
  if (res.ok) await refreshManageProduct();
  else manageError.value = res.error;
}

async function uploadImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !manageProduct.value) return;

  uploading.value = true;
  const res = await catalogApi.uploadImage(manageProduct.value.id, file, false);
  uploading.value = false;
  (event.target as HTMLInputElement).value = "";

  if (res.ok) await refreshManageProduct();
  else manageError.value = res.error;
}

async function removeImage(id: string) {
  const res = await catalogApi.deleteImage(id);
  if (res.ok) await refreshManageProduct();
  else manageError.value = res.error;
}

// "Ganti" — upload the new file, then drop the old one once the new one
// is confirmed up, so a failed upload never leaves a product imageless.
const replaceFileInput = ref<HTMLInputElement | null>(null);
const replacingImageId = ref<string | null>(null);
const replacingImageIsPrimary = ref(false);

function triggerReplace(img: { id: string; isPrimary: boolean }) {
  replacingImageId.value = img.id;
  replacingImageIsPrimary.value = img.isPrimary;
  replaceFileInput.value?.click();
}

async function onReplaceFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  const oldId = replacingImageId.value;
  (event.target as HTMLInputElement).value = "";
  if (!file || !oldId || !manageProduct.value) return;

  uploading.value = true;
  const res = await catalogApi.uploadImage(manageProduct.value.id, file, replacingImageIsPrimary.value);
  if (res.ok) {
    await catalogApi.deleteImage(oldId);
    await refreshManageProduct();
  } else {
    manageError.value = res.error;
  }
  uploading.value = false;
  replacingImageId.value = null;
}
</script>

<template>
  <div class="pb-20">
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold">Produk</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola inventaris, harga, dan ketersediaan produk.</p>
      </div>
      <div class="flex gap-2">
        <button class="border rounded px-4 py-2 text-sm" @click="exportCsv(products.map((p) => p.id))">Export</button>
        <button class="bg-brand-600 text-white rounded px-4 py-2 text-sm" @click="openCreate">+ Tambah Produk</button>
      </div>
    </div>

    <div v-if="stats" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Total Produk"
        :value="String(stats.products.total)"
        :current="stats.products.last7"
        :previous="stats.products.prev7"
      />
      <StatCard
        label="Total Revenue"
        :value="formatRupiah(stats.revenue.total)"
        :current="stats.revenue.last7"
        :previous="stats.revenue.prev7"
      />
      <StatCard
        label="Total Order"
        :value="String(stats.orders.total)"
        :current="stats.orders.last7"
        :previous="stats.orders.prev7"
      />
      <StatCard
        label="Customer"
        :value="String(stats.customers.total)"
        :current="stats.customers.last7"
        :previous="stats.customers.prev7"
      />
    </div>

    <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>

    <div class="bg-white rounded-lg shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3 p-4 border-b">
        <input
          v-model="search"
          type="search"
          placeholder="Cari nama produk atau ID..."
          class="border rounded px-3 py-2 text-sm w-64"
        />
        <div class="flex gap-1 text-sm">
          <button
            v-for="tab in (['all', 'available', 'out-of-stock'] as const)"
            :key="tab"
            class="px-3 py-1.5 rounded"
            :class="statusFilter === tab ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-500 hover:bg-gray-50'"
            @click="statusFilter = tab"
          >
            {{ tab === "all" ? "Semua" : tab === "available" ? "Tersedia" : "Stok Habis" }}
          </button>
        </div>
      </div>

      <table class="w-full text-sm">
        <thead>
          <tr class="text-left border-b text-gray-500">
            <th class="p-3 w-10">
              <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
            </th>
            <th class="p-3">Produk</th>
            <th class="p-3">ID &amp; Dibuat</th>
            <th class="p-3">Harga</th>
            <th class="p-3">Stok</th>
            <th class="p-3">Status</th>
            <th class="p-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredProducts" :key="p.id" class="border-b last:border-0">
            <td class="p-3">
              <input type="checkbox" :checked="selectedIds.has(p.id)" @change="toggleSelect(p.id)" />
            </td>
            <td class="p-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded overflow-hidden shrink-0">
                  <ProductImage :src="p.images[0]?.url" :alt="p.name" />
                </div>
                <div>
                  <p class="font-medium">{{ p.name }}</p>
                  <p class="text-xs text-gray-400">{{ p.category?.name }}</p>
                </div>
              </div>
            </td>
            <td class="p-3 text-gray-500">
              #{{ p.id }}<br />
              <span class="text-xs">{{ new Date(p.createdAt).toLocaleDateString("id-ID") }}</span>
            </td>
            <td class="p-3">
              {{ formatRupiah(Number(p.basePrice)) }}
              <p v-if="p.variants.length" class="text-xs text-gray-400">{{ p.variants.length }} varian</p>
            </td>
            <td class="p-3">{{ totalStock(p) }}</td>
            <td class="p-3">
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="productStatus(p) === 'available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'"
              >
                {{ productStatus(p) === "available" ? "Tersedia" : "Stok Habis" }}
              </span>
            </td>
            <td class="p-3 text-right space-x-2 whitespace-nowrap">
              <button class="text-blue-600" @click="openManage(p)">Kelola</button>
              <button class="text-blue-600" @click="openEdit(p)">Edit</button>
              <button class="text-red-600" @click="remove(p.id)">Hapus</button>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="7" class="p-6 text-center text-gray-400">Tidak ada produk ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="selectedIds.size > 0"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 text-sm z-40"
    >
      <span>{{ selectedIds.size }} Dipilih</span>
      <button class="border border-white/30 rounded px-3 py-1.5 hover:bg-white/10" @click="exportCsv([...selectedIds])">
        Export
      </button>
      <button class="border border-white/30 rounded px-3 py-1.5 hover:bg-white/10" @click="bulkDelete">Hapus</button>
      <button class="text-gray-400 hover:text-white" @click="clearSelection">✕</button>
    </div>

    <BaseModal :show="showModal" :title="editingId ? 'Edit Produk' : 'Tambah Produk'" @close="showModal = false">
      <form class="grid grid-cols-2 gap-3" @submit.prevent="submit">
        <label class="flex flex-col gap-1 text-sm">
          Nama produk
          <input v-model="form.name" required class="border rounded px-3 py-2 text-sm" />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          Slug
          <input v-model="form.slug" required class="border rounded px-3 py-2 text-sm" />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          Kategori
          <select v-model="form.categoryId" required class="border rounded px-3 py-2 text-sm">
            <option value="" disabled>Pilih kategori</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </label>
        <label class="flex flex-col gap-1 text-sm">
          Harga dasar
          <input v-model.number="form.basePrice" type="number" required class="border rounded px-3 py-2 text-sm" />
        </label>
        <label class="flex flex-col gap-1 text-sm col-span-2">
          Jenis kulit (pisah koma)
          <input v-model="form.skinTypes" placeholder="kering, sensitif" class="border rounded px-3 py-2 text-sm" />
        </label>
        <label class="flex flex-col gap-1 text-sm col-span-2">
          Deskripsi
          <textarea v-model="form.description" required class="border rounded px-3 py-2 text-sm" />
        </label>
        <label class="flex flex-col gap-1 text-sm col-span-2">
          Ingredients
          <textarea v-model="form.ingredients" required class="border rounded px-3 py-2 text-sm" />
        </label>
        <p v-if="error" class="text-sm text-red-600 col-span-2">{{ error }}</p>
        <div class="col-span-2 flex gap-2">
          <button class="bg-brand-600 text-white rounded px-4 py-2 text-sm">{{ editingId ? "Update" : "Tambah" }} Produk</button>
          <button type="button" class="text-sm text-gray-500" @click="showModal = false">Batal</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal
      :show="showManageModal"
      :title="manageProduct ? `Varian & Gambar — ${manageProduct.name}` : ''"
      @close="showManageModal = false"
    >
      <div v-if="manageProduct" class="flex flex-col gap-6">
        <p v-if="manageError" class="text-sm text-red-600">{{ manageError }}</p>

        <section>
          <h3 class="font-medium text-sm mb-2">Varian</h3>
          <ul class="flex flex-col gap-1 mb-3">
            <li
              v-for="v in manageProduct.variants"
              :key="v.id"
              class="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-2"
            >
              <span>{{ v.variantName }} &middot; {{ v.sku }} &middot; {{ formatRupiah(Number(v.price)) }} &middot; stok {{ v.stock }}</span>
              <button class="text-red-600 text-xs" @click="removeVariant(v.id)">Hapus</button>
            </li>
            <li v-if="manageProduct.variants.length === 0" class="text-sm text-gray-400">Belum ada varian.</li>
          </ul>

          <form class="grid grid-cols-2 gap-2" @submit.prevent="addVariant">
            <label class="flex flex-col gap-1 text-xs">
              Nama varian
              <input v-model="variantForm.variantName" required class="border rounded px-2 py-1 text-sm" />
            </label>
            <label class="flex flex-col gap-1 text-xs">
              SKU
              <input v-model="variantForm.sku" required class="border rounded px-2 py-1 text-sm" />
            </label>
            <label class="flex flex-col gap-1 text-xs">
              Harga
              <input v-model.number="variantForm.price" type="number" required class="border rounded px-2 py-1 text-sm" />
            </label>
            <label class="flex flex-col gap-1 text-xs">
              Stok
              <input v-model.number="variantForm.stock" type="number" required class="border rounded px-2 py-1 text-sm" />
            </label>
            <button class="col-span-2 bg-gray-800 text-white rounded py-2 text-sm">+ Tambah Varian</button>
          </form>
        </section>

        <section>
          <h3 class="font-medium text-sm mb-2">Gambar</h3>
          <div class="grid grid-cols-4 gap-3 mb-3">
            <div v-for="img in manageProduct.images" :key="img.id" class="relative group">
              <img :src="img.url" class="w-full aspect-square rounded object-cover" />
              <button
                class="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 text-xs text-red-600 shadow"
                title="Hapus gambar"
                @click="removeImage(img.id)"
              >
                ✕
              </button>
              <button
                class="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs py-1 rounded-b opacity-0 group-hover:opacity-100 transition-opacity"
                :disabled="uploading"
                @click="triggerReplace(img)"
              >
                Ganti
              </button>
            </div>
            <p v-if="manageProduct.images.length === 0" class="text-sm text-gray-400 col-span-4">Belum ada gambar.</p>
          </div>
          <input
            ref="replaceFileInput"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            class="hidden"
            @change="onReplaceFileChange"
          />

          <label class="flex flex-col gap-1 text-xs">
            Tambah gambar
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              :disabled="uploading"
              class="text-sm"
              @change="uploadImage"
            />
          </label>
          <span v-if="uploading" class="text-xs text-gray-400">Mengunggah...</span>
        </section>
      </div>
    </BaseModal>
  </div>
</template>

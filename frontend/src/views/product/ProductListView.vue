<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import { useProductStore } from "@/stores/product.store";
import ProductCard from "@/components/product/ProductCard.vue";

const productStore = useProductStore();

const filters = reactive({
  search: "",
  category: "",
  skinType: "",
});

const skinTypes = ["normal", "kering", "berminyak", "kombinasi", "sensitif"];

function applyFilters() {
  productStore.fetchProducts({
    search: filters.search || undefined,
    category: filters.category || undefined,
    skinType: filters.skinType || undefined,
    limit: 24,
  });
}

onMounted(() => {
  productStore.fetchCategories();
  applyFilters();
});

watch(filters, applyFilters);
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-xl font-semibold mb-4">Katalog Produk</h1>

    <div class="flex flex-wrap gap-3 mb-6">
      <input v-model="filters.search" type="search" placeholder="Cari produk..." class="border rounded px-3 py-2 text-sm flex-1 min-w-[200px]" />
      <select v-model="filters.category" class="border rounded px-3 py-2 text-sm">
        <option value="">Semua kategori</option>
        <option v-for="c in productStore.categories" :key="c.id" :value="c.slug">{{ c.name }}</option>
      </select>
      <select v-model="filters.skinType" class="border rounded px-3 py-2 text-sm">
        <option value="">Semua jenis kulit</option>
        <option v-for="s in skinTypes" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <p v-if="!productStore.isLoading && productStore.products.length === 0" class="text-gray-500">
      Produk tidak ditemukan.
    </p>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard v-for="product in productStore.products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

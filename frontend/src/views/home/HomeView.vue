<script setup lang="ts">
import { onMounted } from "vue";
import { useProductStore } from "@/stores/product.store";
import ProductCard from "@/components/product/ProductCard.vue";

const productStore = useProductStore();

onMounted(() => {
  productStore.fetchProducts({ limit: 8 });
});
</script>

<template>
  <div>
    <section class="bg-rose-100">
      <div class="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold text-rose-700">Temukan skincare yang cocok untuk kulitmu</h1>
        <p class="text-gray-600 mt-3">Isi skin quiz singkat, dapatkan rekomendasi produk sesuai jenis kulitmu.</p>
        <router-link
          to="/skin-quiz"
          class="inline-block mt-6 bg-rose-600 text-white px-6 py-3 rounded-full font-medium hover:bg-rose-700"
        >
          Mulai Skin Quiz
        </router-link>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Produk Terbaru</h2>
        <router-link to="/products" class="text-rose-600 text-sm">Lihat semua</router-link>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard v-for="product in productStore.products" :key="product.id" :product="product" />
      </div>
    </section>
  </div>
</template>

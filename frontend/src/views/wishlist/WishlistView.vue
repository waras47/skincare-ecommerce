<script setup lang="ts">
import { onMounted } from "vue";
import { useWishlistStore } from "@/stores/wishlist.store";
import ProductCard from "@/components/product/ProductCard.vue";

const wishlistStore = useWishlistStore();

onMounted(() => wishlistStore.fetch());
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-xl font-semibold mb-6">Wishlist</h1>

    <p v-if="wishlistStore.items.length === 0" class="text-gray-500">Belum ada produk favorit.</p>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="item in wishlistStore.items" :key="item.id" class="relative">
        <ProductCard :product="item.product" />
        <button
          class="absolute top-2 right-2 bg-white rounded-full w-7 h-7 text-rose-600 shadow"
          @click="wishlistStore.remove(item.productId)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

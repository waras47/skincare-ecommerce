<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "@/types";
import { formatRupiah } from "@/composables/format";

const props = defineProps<{ product: Product }>();

const image = computed(() => props.product.images[0]?.url ?? "https://placehold.co/400x400?text=No+Image");
const priceFormatted = computed(() => formatRupiah(Number(props.product.basePrice)));
</script>

<template>
  <router-link
    :to="{ name: 'product-detail', params: { slug: product.slug } }"
    class="block bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
  >
    <img :src="image" :alt="product.name" class="w-full aspect-square object-cover" />
    <div class="p-3">
      <p class="text-xs text-gray-400">{{ product.category?.name }}</p>
      <h3 class="font-medium text-sm truncate">{{ product.name }}</h3>
      <p class="text-rose-600 font-semibold mt-1">{{ priceFormatted }}</p>
    </div>
  </router-link>
</template>

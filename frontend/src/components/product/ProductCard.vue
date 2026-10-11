<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "@/types";
import { formatRupiah } from "@/composables/format";
import ProductImage from "./ProductImage.vue";

const props = defineProps<{ product: Product }>();

const image = computed(() => props.product.images[0]?.url ?? null);
const priceFormatted = computed(() => formatRupiah(Number(props.product.basePrice)));
</script>

<template>
  <router-link
    :to="{ name: 'product-detail', params: { slug: product.slug } }"
    class="block bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
  >
    <div class="aspect-square">
      <ProductImage :src="image" :alt="product.name" />
    </div>
    <div class="p-3">
      <p class="text-xs text-gray-400">{{ product.category?.name }}</p>
      <h3 class="font-medium text-sm truncate">{{ product.name }}</h3>
      <p class="text-brand-600 font-semibold mt-1">{{ priceFormatted }}</p>
    </div>
  </router-link>
</template>

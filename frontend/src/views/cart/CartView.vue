<script setup lang="ts">
import { onMounted } from "vue";
import { useCartStore } from "@/stores/cart.store";
import { formatRupiah } from "@/composables/format";
import ProductImage from "@/components/product/ProductImage.vue";

const cartStore = useCartStore();

onMounted(() => cartStore.fetchCart());
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-xl font-semibold mb-6">Keranjang Belanja</h1>

    <p v-if="!cartStore.isLoading && cartStore.cart?.items.length === 0" class="text-gray-500">
      Keranjang masih kosong. <router-link to="/products" class="text-brand-600 underline">Belanja sekarang</router-link>
    </p>

    <div v-if="cartStore.cart && cartStore.cart.items.length > 0" class="space-y-4">
      <div
        v-for="item in cartStore.cart.items"
        :key="item.id"
        class="bg-white rounded-lg p-4 shadow-sm flex gap-4 items-center"
      >
        <div class="w-16 h-16 rounded overflow-hidden shrink-0">
          <ProductImage :src="item.variant.product.images[0]?.url" :alt="item.variant.product.name" />
        </div>
        <div class="flex-1">
          <p class="font-medium text-sm">{{ item.variant.product.name }}</p>
          <p class="text-xs text-gray-400">{{ item.variant.variantName }}</p>
          <p class="text-brand-600 font-semibold text-sm">{{ formatRupiah(Number(item.variant.price)) }}</p>
        </div>
        <input
          type="number"
          min="1"
          :max="item.variant.stock"
          :value="item.qty"
          class="w-16 border rounded px-2 py-1 text-sm"
          @change="cartStore.updateItem(item.id, Number(($event.target as HTMLInputElement).value))"
        />
        <button class="text-sm text-gray-400 hover:text-red-600" @click="cartStore.removeItem(item.id)">Hapus</button>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
        <span class="font-medium">Subtotal</span>
        <span class="text-brand-600 font-bold">{{ formatRupiah(cartStore.subtotal) }}</span>
      </div>

      <router-link to="/checkout" class="block text-center bg-brand-600 text-white rounded py-3 font-medium">
        Checkout
      </router-link>
    </div>
  </div>
</template>

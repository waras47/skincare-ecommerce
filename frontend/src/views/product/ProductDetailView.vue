<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/stores/product.store";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatRupiah } from "@/composables/format";
import ProductImage from "@/components/product/ProductImage.vue";

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const auth = useAuthStore();

const selectedVariantId = ref<string | null>(null);
const selectedImageUrl = ref<string | null>(null);
const feedback = ref<string | null>(null);

const product = computed(() => productStore.current);
const selectedVariant = computed(() => product.value?.variants.find((v) => v.id === selectedVariantId.value));
const avgRating = computed(() => {
  const reviews = product.value?.reviews ?? [];
  if (reviews.length === 0) return null;
  return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
});
const isWishlisted = computed(() => (product.value ? wishlistStore.isWishlisted(product.value.id) : false));

async function load() {
  await productStore.fetchProduct(route.params.slug as string);
  selectedVariantId.value = productStore.current?.variants[0]?.id ?? null;
  const images = productStore.current?.images ?? [];
  selectedImageUrl.value = (images.find((img) => img.isPrimary) ?? images[0])?.url ?? null;
}

onMounted(() => {
  load();
  if (auth.isLoggedIn) wishlistStore.fetch();
});
watch(() => route.params.slug, load);

async function addToCart() {
  if (!auth.isLoggedIn) {
    feedback.value = "Silakan masuk dulu untuk menambah ke keranjang.";
    return;
  }
  if (!selectedVariant.value) return;
  const ok = await cartStore.addItem(selectedVariant.value.id, 1);
  feedback.value = ok ? "Ditambahkan ke keranjang." : cartStore.error;
}

function toggleWishlist() {
  if (!product.value) return;
  if (isWishlisted.value) wishlistStore.remove(product.value.id);
  else wishlistStore.add(product.value.id);
}
</script>

<template>
  <div v-if="product" class="max-w-5xl mx-auto px-4 py-8 grid sm:grid-cols-2 gap-8">
    <div>
      <div class="rounded-lg overflow-hidden aspect-square">
        <ProductImage :src="selectedImageUrl" :alt="product.name" />
      </div>
      <div v-if="product.images.length > 1" class="flex gap-2 mt-3">
        <button
          v-for="img in product.images"
          :key="img.id"
          class="w-16 h-16 rounded overflow-hidden border-2 shrink-0"
          :class="selectedImageUrl === img.url ? 'border-brand-600' : 'border-transparent'"
          @click="selectedImageUrl = img.url"
        >
          <ProductImage :src="img.url" :alt="product.name" />
        </button>
      </div>
    </div>

    <div>
      <p class="text-xs text-gray-400">{{ product.category?.name }}</p>
      <h1 class="text-2xl font-semibold">{{ product.name }}</h1>
      <p v-if="avgRating" class="text-sm text-amber-500 mt-1">★ {{ avgRating }} ({{ product.reviews?.length }} ulasan)</p>

      <p class="text-brand-600 text-xl font-bold mt-3">
        {{ formatRupiah(Number(selectedVariant?.price ?? product.basePrice)) }}
      </p>

      <div class="mt-4">
        <label class="text-sm font-medium block mb-1">Varian</label>
        <select v-model="selectedVariantId" class="border rounded px-3 py-2 text-sm w-full">
          <option v-for="v in product.variants" :key="v.id" :value="v.id">
            {{ v.variantName }} &mdash; stok {{ v.stock }}
          </option>
        </select>
      </div>

      <div class="flex gap-2 mt-4">
        <button
          :disabled="!selectedVariant || selectedVariant.stock < 1"
          class="flex-1 bg-brand-600 text-white rounded py-2 font-medium disabled:opacity-50"
          @click="addToCart"
        >
          {{ selectedVariant && selectedVariant.stock < 1 ? "Stok habis" : "Tambah ke Keranjang" }}
        </button>
        <button v-if="auth.isLoggedIn" class="border rounded px-4" :class="{ 'text-brand-600 border-brand-600': isWishlisted }" @click="toggleWishlist">
          ♥
        </button>
      </div>
      <p v-if="feedback" class="text-sm text-gray-500 mt-2">{{ feedback }}</p>

      <div class="mt-6 space-y-3 text-sm">
        <div>
          <h2 class="font-medium mb-1">Deskripsi</h2>
          <p class="text-gray-600">{{ product.description }}</p>
        </div>
        <div>
          <h2 class="font-medium mb-1">Ingredients</h2>
          <p class="text-gray-600">{{ product.ingredients }}</p>
        </div>
        <div>
          <h2 class="font-medium mb-1">Cocok untuk jenis kulit</h2>
          <p class="text-gray-600">{{ product.skinTypes.join(", ") }}</p>
        </div>
      </div>

      <div class="mt-6">
        <h2 class="font-medium mb-2">Ulasan</h2>
        <p v-if="!product.reviews?.length" class="text-sm text-gray-400">Belum ada ulasan.</p>
        <div v-for="review in product.reviews" :key="review.id" class="border-t py-2 text-sm">
          <p class="font-medium">{{ review.user.name }} &middot; ★ {{ review.rating }}</p>
          <p class="text-gray-600">{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

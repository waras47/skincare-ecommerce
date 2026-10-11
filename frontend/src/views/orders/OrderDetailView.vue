<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { useOrderStore } from "@/stores/order.store";
import { reviewsApi } from "@/api/endpoints/reviews.api";
import { formatRupiah } from "@/composables/format";

const route = useRoute();
const orderStore = useOrderStore();

const reviewForms = reactive<Record<string, { rating: number; comment: string; submitting: boolean; done: boolean; error: string | null }>>({});

onMounted(() => orderStore.fetchOrder(route.params.id as string));

function formFor(orderItemId: string) {
  if (!reviewForms[orderItemId]) {
    reviewForms[orderItemId] = { rating: 5, comment: "", submitting: false, done: false, error: null };
  }
  return reviewForms[orderItemId];
}

async function submitReview(orderItemId: string) {
  const form = formFor(orderItemId);
  form.submitting = true;
  form.error = null;
  const res = await reviewsApi.create({ orderItemId, rating: form.rating, comment: form.comment });
  form.submitting = false;
  if (res.ok) {
    form.done = true;
    await orderStore.fetchOrder(route.params.id as string);
  } else {
    form.error = res.error;
  }
}
</script>

<template>
  <div v-if="orderStore.current" class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-xl font-semibold mb-1">Order #{{ orderStore.current.id }}</h1>
    <p class="text-sm text-gray-500 mb-6 capitalize">Status: {{ orderStore.current.status }}</p>

    <section class="bg-white rounded-lg p-4 shadow-sm mb-4">
      <h2 class="font-medium mb-2">Alamat</h2>
      <p class="text-sm text-gray-600">
        {{ orderStore.current.address.recipient }} &middot; {{ orderStore.current.address.phone }}<br />
        {{ orderStore.current.address.fullAddress }}, {{ orderStore.current.address.city }}
      </p>
    </section>

    <section class="bg-white rounded-lg p-4 shadow-sm mb-4">
      <h2 class="font-medium mb-3">Item</h2>
      <div v-for="item in orderStore.current.items" :key="item.id" class="border-t first:border-t-0 py-3">
        <div class="flex justify-between text-sm">
          <span>{{ item.variant.product.name }} ({{ item.variant.variantName }}) x{{ item.qty }}</span>
          <span>{{ formatRupiah(Number(item.price) * item.qty) }}</span>
        </div>

        <div v-if="orderStore.current.status === 'completed'" class="mt-2">
          <p v-if="item.review" class="text-xs text-green-600">Sudah diulas &middot; ★ {{ item.review.rating }}</p>
          <div v-else-if="formFor(item.id).done" class="text-xs text-green-600">Terima kasih atas ulasannya!</div>
          <form v-else class="flex flex-col gap-2 mt-1" @submit.prevent="submitReview(item.id)">
            <select v-model.number="formFor(item.id).rating" class="border rounded px-2 py-1 text-xs w-24">
              <option v-for="n in [5, 4, 3, 2, 1]" :key="n" :value="n">{{ n }} ★</option>
            </select>
            <textarea v-model="formFor(item.id).comment" placeholder="Tulis ulasan..." required class="border rounded px-2 py-1 text-xs" />
            <p v-if="formFor(item.id).error" class="text-xs text-red-600">{{ formFor(item.id).error }}</p>
            <button :disabled="formFor(item.id).submitting" class="self-start bg-gray-800 text-white rounded px-3 py-1 text-xs">
              Kirim ulasan
            </button>
          </form>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-lg p-4 shadow-sm mb-4">
      <div class="flex justify-between font-medium">
        <span>Total</span>
        <span class="text-brand-600">{{ formatRupiah(Number(orderStore.current.totalAmount)) }}</span>
      </div>
      <p v-if="orderStore.current.payment" class="text-xs text-gray-400 mt-1">
        Pembayaran: {{ orderStore.current.payment.method }} &middot; {{ orderStore.current.payment.status }}
      </p>
    </section>
  </div>
</template>

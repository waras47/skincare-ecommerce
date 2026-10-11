<script setup lang="ts">
import { onMounted } from "vue";
import { useOrderStore } from "@/stores/order.store";
import { formatRupiah } from "@/composables/format";

const orderStore = useOrderStore();

onMounted(() => orderStore.fetchOrders());

const statusLabel: Record<string, string> = {
  pending: "Menunggu pembayaran",
  paid: "Dibayar",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  failed: "Gagal",
};
const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
  failed: "bg-red-100 text-red-700",
};
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-xl font-semibold mb-6">Riwayat Pesanan</h1>

    <p v-if="!orderStore.isLoading && orderStore.orders.length === 0" class="text-gray-500">Belum ada pesanan.</p>

    <router-link
      v-for="order in orderStore.orders"
      :key="order.id"
      :to="{ name: 'order-detail', params: { id: order.id } }"
      class="block bg-white rounded-lg p-4 shadow-sm mb-3"
    >
      <div class="flex items-center justify-between">
        <span class="font-medium text-sm">Order #{{ order.id }}</span>
        <span class="text-xs px-2 py-1 rounded-full" :class="statusColor[order.status]">{{ statusLabel[order.status] }}</span>
      </div>
      <p class="text-xs text-gray-400 mt-1">{{ new Date(order.createdAt).toLocaleString("id-ID") }}</p>
      <p class="text-brand-600 font-semibold mt-1">{{ formatRupiah(Number(order.totalAmount)) }}</p>
    </router-link>
  </div>
</template>

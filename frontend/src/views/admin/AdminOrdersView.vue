<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ordersApi } from "@/api/endpoints/orders.api";
import type { Order, OrderStatus } from "@/types";
import { formatRupiah } from "@/composables/format";

const orders = ref<Order[]>([]);
const statuses: OrderStatus[] = ["pending", "paid", "shipped", "completed", "cancelled", "failed"];

async function load() {
  const res = await ordersApi.listAll({ limit: 100 });
  if (res.ok) orders.value = res.data.orders;
}
onMounted(load);

async function changeStatus(orderId: string, status: OrderStatus) {
  await ordersApi.updateStatus(orderId, status);
  load();
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold mb-6">Order</h1>

    <table class="w-full bg-white rounded-lg shadow-sm text-sm">
      <thead>
        <tr class="text-left border-b">
          <th class="p-3">Order</th>
          <th class="p-3">Customer</th>
          <th class="p-3">Total</th>
          <th class="p-3">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in orders" :key="o.id" class="border-b last:border-0">
          <td class="p-3">#{{ o.id }}<br /><span class="text-xs text-gray-400">{{ new Date(o.createdAt).toLocaleDateString("id-ID") }}</span></td>
          <td class="p-3">{{ o.user?.name }}<br /><span class="text-xs text-gray-400">{{ o.user?.email }}</span></td>
          <td class="p-3">{{ formatRupiah(Number(o.totalAmount)) }}</td>
          <td class="p-3">
            <select
              :value="o.status"
              class="border rounded px-2 py-1 text-xs"
              @change="changeStatus(o.id, ($event.target as HTMLSelectElement).value as OrderStatus)"
            >
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

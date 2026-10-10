<script setup lang="ts">
import { onMounted, ref } from "vue";
import { reviewsApi } from "@/api/endpoints/reviews.api";
import type { Review } from "@/types";

const reviews = ref<(Review & { product: { name: string } })[]>([]);

async function load() {
  const res = await reviewsApi.listAll();
  if (res.ok) reviews.value = res.data as (Review & { product: { name: string } })[];
}
onMounted(load);

async function toggleApprove(id: string, current: boolean) {
  await reviewsApi.setApproved(id, !current);
  load();
}

async function remove(id: string) {
  await reviewsApi.remove(id);
  load();
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold mb-6">Moderasi Review</h1>

    <table class="w-full bg-white rounded-lg shadow-sm text-sm">
      <thead>
        <tr class="text-left border-b">
          <th class="p-3">Produk</th>
          <th class="p-3">Rating</th>
          <th class="p-3">Komentar</th>
          <th class="p-3">Status</th>
          <th class="p-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in reviews" :key="r.id" class="border-b last:border-0">
          <td class="p-3">{{ r.product.name }}</td>
          <td class="p-3">★ {{ r.rating }}</td>
          <td class="p-3 max-w-xs truncate">{{ r.comment }}</td>
          <td class="p-3">
            <span :class="r.isApproved ? 'text-green-600' : 'text-gray-400'">
              {{ r.isApproved ? "Tampil" : "Disembunyikan" }}
            </span>
          </td>
          <td class="p-3 text-right space-x-2">
            <button class="text-blue-600" @click="toggleApprove(r.id, r.isApproved)">
              {{ r.isApproved ? "Sembunyikan" : "Tampilkan" }}
            </button>
            <button class="text-red-600" @click="remove(r.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

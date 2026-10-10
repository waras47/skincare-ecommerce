<script setup lang="ts">
import { onMounted, ref } from "vue";
import { usersApi } from "@/api/endpoints/users.api";
import type { User } from "@/types";

const customers = ref<User[]>([]);

onMounted(async () => {
  const res = await usersApi.listCustomers();
  if (res.ok) customers.value = res.data;
});
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold mb-6">User (Customer)</h1>

    <table class="w-full bg-white rounded-lg shadow-sm text-sm">
      <thead>
        <tr class="text-left border-b">
          <th class="p-3">Nama</th>
          <th class="p-3">Email</th>
          <th class="p-3">Jenis Kulit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in customers" :key="u.id" class="border-b last:border-0">
          <td class="p-3">{{ u.name }}</td>
          <td class="p-3">{{ u.email }}</td>
          <td class="p-3">{{ u.skinType ?? "-" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

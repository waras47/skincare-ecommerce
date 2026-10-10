<script setup lang="ts">
const links = [
  { to: "/admin/products", label: "Produk" },
  { to: "/admin/categories", label: "Kategori" },
  { to: "/admin/skin-quiz", label: "Skin Quiz" },
  { to: "/admin/orders", label: "Order" },
  { to: "/admin/users", label: "User" },
  { to: "/admin/reviews", label: "Review" },
];
</script>

<template>
  <div class="min-h-screen flex bg-gray-50">
    <aside class="w-56 bg-white border-r p-4 shrink-0">
      <router-link to="/" class="block font-bold text-rose-600 mb-6">Skincare.co</router-link>
      <nav class="flex flex-col gap-1 text-sm">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="px-3 py-2 rounded hover:bg-rose-50"
          active-class="bg-rose-100 text-rose-700 font-medium"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </aside>
    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>

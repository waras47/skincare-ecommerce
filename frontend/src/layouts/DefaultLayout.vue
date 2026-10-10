<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";

const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Produk" },
  { to: "/skin-quiz", label: "Skin Quiz" },
];

const greeting = computed(() => auth.user?.name ?? "");

function logout() {
  auth.logout();
  cart.clearLocal();
  router.push("/");
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-rose-50">
    <header class="bg-white border-b sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <router-link to="/" class="font-bold text-lg text-rose-600">Skincare.co</router-link>
        <nav class="hidden sm:flex gap-6 text-sm">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to" class="hover:text-rose-600">
            {{ link.label }}
          </router-link>
        </nav>
        <div class="flex items-center gap-4 text-sm">
          <router-link v-if="auth.isLoggedIn" to="/wishlist" class="hover:text-rose-600">Wishlist</router-link>
          <router-link v-if="auth.isLoggedIn" to="/cart" class="hover:text-rose-600 relative">
            Keranjang
            <span v-if="cart.itemCount" class="ml-1 text-xs bg-rose-600 text-white rounded-full px-1.5">{{ cart.itemCount }}</span>
          </router-link>
          <router-link v-if="auth.isLoggedIn" to="/orders" class="hover:text-rose-600">Pesanan</router-link>
          <router-link v-if="auth.isAdmin" to="/admin/products" class="hover:text-rose-600">Admin</router-link>
          <template v-if="auth.isLoggedIn">
            <router-link to="/profile" class="hover:text-rose-600">{{ greeting }}</router-link>
            <button class="text-rose-600" @click="logout">Keluar</button>
          </template>
          <router-link v-else to="/login" class="hover:text-rose-600">Masuk</router-link>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <router-view />
    </main>

    <footer class="border-t bg-white text-center text-sm text-gray-500 py-6">
      Skincare.co &mdash; skill-test project, bukan toko sungguhan.
    </footer>
  </div>
</template>

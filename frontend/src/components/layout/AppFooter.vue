<script setup lang="ts">
import { ref } from "vue";

const trustBadges = [
  { icon: "box", label: "Pengiriman ke Seluruh Indonesia" },
  { icon: "check", label: "Produk 100% Original" },
  { icon: "percent", label: "Harga Terbaik" },
  { icon: "gift", label: "Reward untuk Member" },
];

const icons: Record<string, string> = {
  box: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.27 6.96 12 12l8.73-5.04M12 22.08V12",
  check: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  percent: "M19 5 5 19M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm11 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  gift: "M20 12v10H4V12M2 7h20v5H2V7Zm10-5v20M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z",
  instagram:
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10.5 2.5h.01M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  youtube: "M2 12s0-4 .5-5.5A3 3 0 0 1 4.6 4.4C8 4 12 4 12 4s4 0 7.4.4a3 3 0 0 1 2.1 2.1C22 8 22 12 22 12s0 4-.5 5.5a3 3 0 0 1-2.1 2.1C16 20 12 20 12 20s-4 0-7.4-.4a3 3 0 0 1-2.1-2.1C2 16 2 12 2 12Zm8-3 5 3-5 3V9Z",
  tiktok: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5",
};

const email = ref("");
const subscribed = ref(false);

function subscribe() {
  if (!email.value) return;
  subscribed.value = true;
  email.value = "";
}
</script>

<template>
  <footer class="border-t">
    <div class="bg-brand-50">
      <div class="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div v-for="badge in trustBadges" :key="badge.label" class="flex flex-col items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6 text-gray-700">
            <path :d="icons[badge.icon]" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="text-xs font-semibold tracking-wide">{{ badge.label.toUpperCase() }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
      <div>
        <h3 class="font-semibold mb-3">Hubungi Kami</h3>
        <p class="font-medium">Email:</p>
        <p class="text-gray-500 mb-3">cs@skincare.co</p>
        <p class="font-medium">Jam Kerja:</p>
        <p class="text-gray-500">Senin - Jumat 9:00 - 18:00 WIB</p>
        <p class="text-gray-500 mb-3">Tidak beroperasi pada hari Sabtu, Minggu, dan hari libur.</p>
        <div class="flex gap-3 text-gray-500">
          <a v-for="s in ['instagram', 'youtube', 'tiktok']" :key="s" href="#" class="hover:text-brand-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
              <path :d="icons[s]" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-3">Tentang Kami</h3>
        <ul class="flex flex-col gap-2 text-gray-500">
          <li>Tentang Skincare.co</li>
          <li>Hubungi Kami</li>
          <li>Cara Kerja Skin Quiz</li>
          <li>Program Member</li>
        </ul>
      </div>

      <div>
        <h3 class="font-semibold mb-3">Informasi Berguna</h3>
        <ul class="flex flex-col gap-2 text-gray-500">
          <li>FAQ</li>
          <li>Kebijakan Pengiriman</li>
          <li>Kebijakan Pengembalian Barang</li>
          <li>Kebijakan Privasi</li>
          <li>Ketentuan Layanan</li>
        </ul>
      </div>

      <div>
        <h3 class="font-semibold mb-3">Dapatkan Promo Eksklusif</h3>
        <p class="text-gray-500 mb-3">
          Daftar sekarang untuk jadi yang pertama mendapatkan penawaran dan promo menarik dan menguntungkan.
        </p>
        <form v-if="!subscribed" class="flex flex-col gap-2" @submit.prevent="subscribe">
          <input v-model="email" type="email" placeholder="Enter email" required class="border rounded px-3 py-2 text-sm" />
          <button class="bg-brand-600 hover:bg-brand-700 text-white rounded px-4 py-2 text-sm font-semibold">
            SIGN UP
          </button>
        </form>
        <p v-else class="text-green-600 text-sm">Terima kasih sudah mendaftar!</p>
      </div>
    </div>

    <div class="border-t py-4 text-center text-xs text-gray-400">
      Skincare.co &mdash; skill-test project, bukan toko sungguhan.
    </div>
  </footer>
</template>

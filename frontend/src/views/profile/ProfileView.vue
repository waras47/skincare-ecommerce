<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { usersApi } from "@/api/endpoints/users.api";
import type { Address } from "@/types";

const auth = useAuthStore();

const profileForm = reactive({ name: auth.user?.name ?? "", skinType: auth.user?.skinType ?? "" });
const profileFeedback = ref<string | null>(null);

const addresses = ref<Address[]>([]);
const newAddress = reactive({ label: "", recipient: "", phone: "", fullAddress: "", city: "", postalCode: "", isDefault: false });
const showNewAddress = ref(false);

async function loadAddresses() {
  const res = await usersApi.listAddresses();
  if (res.ok) addresses.value = res.data;
}

onMounted(loadAddresses);

async function saveProfile() {
  const res = await usersApi.updateProfile(profileForm);
  if (res.ok) {
    auth.setUser(res.data);
    profileFeedback.value = "Profil berhasil diperbarui.";
  } else {
    profileFeedback.value = res.error;
  }
}

async function addAddress() {
  const res = await usersApi.createAddress(newAddress);
  if (res.ok) {
    addresses.value.push(res.data);
    showNewAddress.value = false;
  }
}

async function removeAddress(id: string) {
  const res = await usersApi.deleteAddress(id);
  if (res.ok) addresses.value = addresses.value.filter((a) => a.id !== id);
}
</script>

<template>
  <div class="max-w-xl mx-auto px-4 py-8 space-y-6">
    <section class="bg-white rounded-lg p-4 shadow-sm">
      <h1 class="font-medium mb-3">Profil</h1>
      <form class="flex flex-col gap-3" @submit.prevent="saveProfile">
        <label class="flex flex-col gap-1 text-sm">
          Nama
          <input v-model="profileForm.name" class="border rounded px-3 py-2" />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          Jenis kulit
          <input v-model="profileForm.skinType" class="border rounded px-3 py-2" placeholder="isi lewat skin quiz atau manual" />
        </label>
        <p v-if="profileFeedback" class="text-sm text-gray-500">{{ profileFeedback }}</p>
        <button class="self-start bg-brand-600 text-white rounded px-4 py-2 text-sm">Simpan</button>
      </form>
    </section>

    <section class="bg-white rounded-lg p-4 shadow-sm">
      <h2 class="font-medium mb-3">Alamat Tersimpan</h2>
      <div v-for="address in addresses" :key="address.id" class="flex justify-between items-start text-sm border-t first:border-t-0 py-2">
        <div>
          <p class="font-medium">{{ address.label }} &middot; {{ address.recipient }}</p>
          <p class="text-gray-500">{{ address.fullAddress }}, {{ address.city }} {{ address.postalCode }}</p>
        </div>
        <button class="text-gray-400 hover:text-red-600" @click="removeAddress(address.id)">Hapus</button>
      </div>

      <button class="text-brand-600 text-sm mt-3" @click="showNewAddress = !showNewAddress">+ Tambah alamat</button>
      <form v-if="showNewAddress" class="grid grid-cols-2 gap-2 mt-3" @submit.prevent="addAddress">
        <input v-model="newAddress.label" placeholder="Label" class="border rounded px-3 py-2 text-sm col-span-2" required />
        <input v-model="newAddress.recipient" placeholder="Nama penerima" class="border rounded px-3 py-2 text-sm col-span-2" required />
        <input v-model="newAddress.phone" placeholder="No. HP" class="border rounded px-3 py-2 text-sm col-span-2" required />
        <textarea v-model="newAddress.fullAddress" placeholder="Alamat lengkap" class="border rounded px-3 py-2 text-sm col-span-2" required />
        <input v-model="newAddress.city" placeholder="Kota" class="border rounded px-3 py-2 text-sm" required />
        <input v-model="newAddress.postalCode" placeholder="Kode pos" class="border rounded px-3 py-2 text-sm" required />
        <button type="submit" class="col-span-2 bg-gray-800 text-white rounded py-2 text-sm">Simpan alamat</button>
      </form>
    </section>
  </div>
</template>

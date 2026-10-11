<script setup lang="ts">
import { computed } from "vue";
import { pctChange } from "@/composables/format";

const props = defineProps<{
  label: string;
  value: string;
  current: number;
  previous: number;
}>();

const change = computed(() => pctChange(props.current, props.previous));
</script>

<template>
  <div class="bg-white rounded-lg border p-4">
    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ label }}</p>
    <p class="text-2xl font-bold mt-2">{{ value }}</p>
    <div class="flex items-center gap-2 mt-1">
      <span
        v-if="change !== null"
        class="text-xs font-medium px-1.5 py-0.5 rounded"
        :class="change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
      >
        {{ change >= 0 ? "+" : "" }}{{ change.toFixed(1) }}%
      </span>
      <span class="text-xs text-gray-400">7 hari terakhir</span>
    </div>
  </div>
</template>

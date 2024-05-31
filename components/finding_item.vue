<script lang="ts" setup>

const props = defineProps<{
  label: string;
  loading: boolean;
}>()
</script>

<template>
  <div class="grid grid-cols-2">
    <div class="col-span-1 font-['Roboto'] text-sm text-gray-800 flex items-center">{{ label }}</div>
    <div class="col-span-1 flex flex-col items-center justify-center">
      <template v-if="loading">
        Loading</template>
      <template v-else>
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<style scoped></style>

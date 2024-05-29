<script lang="ts" setup>

const props = defineProps<{
  label: string
}>()
</script>

<template>
  <div class="grid grid-cols-2">
    <div class="col-span-1 font-['Roboto'] text-sm text-gray-800">{{ label }}</div>
    <div class="col-span-1">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
const props = defineProps<{
  label: string
  subtitle: string
  labelClass?: string
  name?: string;
}>()
</script>

<template>
  <div class="flex justify-between items-center">
    <UFormGroup :name="name">
      <template #label>
        <div class="font-bold text-sm" :class="labelClass">{{ label }}</div>
      </template>
      <div class="text-xs">{{ subtitle }}</div>
    </UFormGroup>
    <slot></slot>
  </div>
</template>

<style scoped></style>

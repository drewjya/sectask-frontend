<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String,
    required: true

  },

})
</script>

<template>
  <div class="flex gap-3 items-center ">
    <div class=" text-[0.9rem]  text-[#68707D] flex-1 flex justify-between items-center text-['DM Sans']">
      <div>{{ label }}</div>
      <div>:</div>
    </div>
    <div class="flex-1 text-sm">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>

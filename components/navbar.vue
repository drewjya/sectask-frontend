<script lang="ts" setup>
const app = useApp()
</script>

<template>
  <div class="border-b py-1">

    <UButton @click="app.sidebar = !app.sidebar" icon="i-heroicons-chevron-double-left-16-solid" variant="ghost"
      color="gray" class="hover:bg-transparent" />
  </div>
</template>

<style scoped></style>

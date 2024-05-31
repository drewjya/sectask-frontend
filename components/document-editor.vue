<script lang="ts" setup>
const store = findingStore()
const loading = computed(() => store.loading);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="text-lg font-bold">Description</div>

      <div class="bg-red-100 w-full h-64 rounded-lg" v-if="loading"></div>
      <Editor :editor-id="store.descriptionId" v-if="store.descriptionId" />
    </div>
    <div class="flex flex-col gap-2">
      <div class="text-lg font-bold">Threat & Risk</div>
      <div class="bg-red-100 w-full h-64 rounded-lg" v-if="loading"></div>
      <Editor :editor-id="store.threatAndRiskId" v-else-if="store.threatAndRiskId" />
    </div>
  </div>
</template>

<style scoped></style>

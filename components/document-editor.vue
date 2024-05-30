<script lang="ts" setup>
const store = findingStore()
const finding = computed(() => store.finding);
</script>

<template>
  <div class="flex flex-col gap-4" v-if="finding">
    <div class="flex flex-col gap-2">
      <div class="text-lg font-bold">Description</div>
      <Editor :editor-id="finding.descriptionId" />
    </div>
    <div class="flex flex-col gap-2">
      <div class="text-lg font-bold">Threat & Risk</div>
      <Editor :editor-id="finding.descriptionId" />
    </div>
  </div>
</template>

<style scoped></style>

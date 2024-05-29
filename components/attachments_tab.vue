<script lang="ts" setup>
import type { VFile } from '~/types/data/file';


const props = defineProps<{
  attachments: VFile[]
  reports: VFile[]
}>()

</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
    <VFileList title="Reports" :files="props.reports" />
    <VFileList title="Attachment" :files="props.attachments" />

  </div>
</template>

<style scoped></style>

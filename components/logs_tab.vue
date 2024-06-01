<script lang="ts" setup>
import type { LogData } from '~/types/data/project/project';


const props = defineProps<{
  logs?: LogData[]
  loading: boolean
}>()

</script>

<template>
  <div v-if="loading || !logs"></div>
  <div v-else class="flex flex-col gap-2">

    <div class="px-2 flex flex-col " v-for="i in props.logs">
      <div
        class="flex items-start gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">

        <UAvatar :alt="i.title" size="sm" />
        <div class="flex flex-col">
          <span class=" font-semibold">{{ i.title }}</span>
          <span class="text-sm opacity-70" v-html="i.description"></span>
        </div>

      </div>
      <span class="w-full py-1 text-right text-xs opacity-70">{{ formatDate(i.createdAt, "ddd, MMM D, YYYY HH:mm")
        }}</span>
    </div>

  </div>
</template>

<style scoped></style>

<script lang="ts" setup>


import type { VFile } from '~/types/data/file';


const props = defineProps<{
  files: VFile[]
  title: string
}>()


const getIcon = (data: VFile) => {
  if (data.contentType.toLowerCase().startsWith("image")) {
    return "i-heroicons-photo"
  } else if (data.contentType.toLowerCase().startsWith("video")) {
    return "i-heroicons-play"
  } else if (data.contentType.toLowerCase().startsWith("audio")) {
    return "i-heroicons-musical-note"
  } else {
    return "i-heroicons-document"
  }
}

const fileUrl = useRuntimeConfig().public.FILE_URL
</script>

<template>
  <div class="flex flex-col gap-2 pb-4">
    <div class="flex justify-between px-2">
      <div class="font-bold text-lg font-['DM Sans']">{{ title }}</div>
      <UButton icon="i-heroicons-arrow-up-on-square" size="sm" color="white" variant="solid" />

    </div>

    <div class="bg-gray-200 p-3 rounded h-96 overflow-y-auto flex flex-col gap-2">
      <div v-for="i in files" class="bg-white p-2 flex items-center gap-2">
        <div class="p-4 ">
          <UIcon :name="getIcon(i)" class="text-4xl text-blue-400" />
        </div>
        <div>
          <div>{{ i.originalName }}</div>
          <div>{{ formatDate(i.createdAt, "DD MMM YYYY, HH:mm") }}</div>

        </div>
        <div class="grow flex justify-end items-end  h-full">
          <UButton icon="i-heroicons-arrow-down-circle" @click="downloadAs(i)" variant="ghost" color="red" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped></style>

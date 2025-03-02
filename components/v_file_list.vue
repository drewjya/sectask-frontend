<script lang="ts" setup>
import { isApiError } from "~/types/api/error";
import type { VFile } from "~/types/data/file";

const props = defineProps<{
  files?: VFile[];
  loading: boolean;
  title: string;
  type: string;
  doctype: string;
  docId: number;
  canUpload: boolean;
}>();
const api = usePrivateApi();
const notif = useNotification();
const removeFile = async (id: number) => {
  try {
    await api.post(
      `/${props.doctype}/${props.docId}/${props.type}/remove/${id}`
    );
    notif.ok({ message: "File removed" });
    return;
  } catch (error) {
    if (isApiError(error)) {
      notif.error({ message: error.message });
    } else {
      notif.error({ message: "Try again later" });
    }
  }
};

const emit = defineEmits(["upload"]);

const getIcon = (data: VFile) => {
  if (data.contentType.toLowerCase().startsWith("image")) {
    return "i-heroicons-photo";
  } else if (data.contentType.toLowerCase().startsWith("video")) {
    return "i-heroicons-play";
  } else if (data.contentType.toLowerCase().startsWith("audio")) {
    return "i-heroicons-musical-note";
  } else {
    return "i-heroicons-document";
  }
};

const fileUrl = useRuntimeConfig().public.FILE_URL;
</script>

<template>
  <div class="flex flex-col gap-2 pb-4">
    <div class="flex justify-between px-2">
      <div class="font-bold text-lg font-['DM Sans']">{{ title }}</div>
      <UButton
        icon="i-heroicons-arrow-up-on-square"
        size="sm"
        color="white"
        variant="solid"
        v-if="canUpload"
        @click="() => emit('upload')"
      />
    </div>
    <div v-if="loading || !files"></div>
    <div v-else-if="files.length == 0">
      <div
        class="bg-gray-200 dark:dark:bg-gray-800 p-3 rounded max-h-96 min-h-20 overflow-y-auto flex flex-col gap-2 items-center justify-center"
      >
        <div class="text-center text-sm font-['Roboto']">
          No <span class="lowercase">{{ title }}</span> uploaded
        </div>
      </div>
    </div>
    <div
      v-else
      class="bg-gray-200 dark:dark:bg-gray-800 p-3 rounded max-h-96 min-h-20 overflow-y-auto flex flex-col gap-2"
    >
      <div
        v-for="i in files"
        class="bg-white dark:bg-gray-900 p-2 flex items-center gap-2 rounded-md"
      >
        <div class="p-4">
          <UIcon :name="getIcon(i)" class="text-4xl text-blue-400" />
        </div>
        <div class="dark:text-white text-sm font-['Lato']">
          <div>{{ i.originalName }}</div>
          <div>{{ formatDate(i.createdAt, "DD MMM YYYY, HH:mm") }}</div>
        </div>
        <div class="grow flex justify-end items-end h-full flex-col">
          <UButton
            icon="i-heroicons-x-circle"
            v-if="canUpload"
            @click="removeFile(i.id)"
            variant="ghost"
            color="red"
          />
          <UButton
            icon="i-heroicons-arrow-down-circle"
            @click="downloadAs(i)"
            variant="ghost"
            color="green"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import type { Chat } from "~/types/data/finding/finding";

const emits = defineEmits<{
  reply: [chat: Chat];
}>();

const props = defineProps<{
  chat: Chat;
}>();

const { x, y } = useMouse();
const { y: windowY } = useWindowScroll();

const isOpen = ref(false);
const virtualElement = ref({ getBoundingClientRect: () => ({}) });

const onClick = () => {
  const top = unref(y) - unref(windowY);
  const left = unref(x);

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top,
    left,
  });

  isOpen.value = true;
};

const onClickReply = () => {
  emits("reply", props.chat);
  isOpen.value = false;
  x.value = 0;
  y.value = 0;
};
</script>

<template>
  <div class="relative w-full">
    <div
      class="bg-slate-100 dark:bg-gray-800 dark:border-slate-700 border border-slate-300 p-1 px-2 rounded-md flex flex-col gap-2"
    >
      <div
        class="flex gap-2 items-center justify-between"
        @contextmenu.prevent="onClick"
        @click="onClick"
      >
        <div class="flex items-center gap-2">
          <UAvatar
            size="sm"
            :src="formatImage(chat.sender.profilePicture)"
            :alt="chat.sender.name.toUpperCase()"
          />
          <div class="font-bold">{{ chat.sender.name }}</div>
        </div>
        <div class="text-xs">
          {{ formatDate(chat.createdAt, "DD-MM-YYYY, HH:mm") }}
        </div>
      </div>
      <div class="flex w-full justify-end" v-if="chat.replyChat">
        <div
          class="flex flex-col gap-2 w-[calc(100%-2rem)] bg-gray-300 dark:bg-gray-900 p-1.5 rounded"
        >
          <div class="text-sm font-['Roboto']">replied to</div>
          <div class="flex gap-2 items-center justify-between">
            <div class="flex items-center gap-1">
              <UAvatar
                size="sm"
                :src="formatImage(chat.sender.profilePicture)"
                :alt="chat.sender.name.toUpperCase()"
              />
              <div class="font-bold">{{ chat.sender.name }}</div>
            </div>
            <div class="text-xs">
              {{ formatDate(chat.createdAt, "DD-MM-YYYY, HH:mm") }}
            </div>
          </div>
          <div
            v-html="chat.replyChat.content"
            class="bg-slate-200 dark:bg-slate-800 p-1 rounded px-2 w-full"
          ></div>
        </div>
      </div>
      <div
        v-html="chat.content"
        class="bg-slate-200 p-1 rounded px-2 prose-p text-sm dark:bg-slate-700"
      ></div>
    </div>
    <UContextMenu v-model="isOpen" :virtual-element="virtualElement">
      <UButton
        label="Reply"
        @click="onClickReply"
        color="black"
        class="rounded px-4"
      />
    </UContextMenu>
  </div>
</template>

<style scoped></style>

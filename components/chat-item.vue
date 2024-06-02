<script lang="ts" setup>
import type { Chat } from '~/types/data/finding/finding';

const emits = defineEmits<{
  reply: [chat: Chat]
}>()

const props = defineProps<{
  chat: Chat
}>()

const show = ref(false)
const x = ref(0)
const y = ref(0)

const onClick = (source: MouseEvent) => {
  show.value = true;
  const client = { x: source.offsetX, y: source.offsetX }
  const page = { x: source.pageX, y: source.pageY }
  const val = { x: source.x, y: source.y }
  console.log(`${JSON.stringify(client)} ${JSON.stringify(page)} ${JSON.stringify(val)}`);

  x.value = source.offsetX
  y.value = source.offsetY

}


const onClickReply = () => {
  emits('reply', props.chat)
  show.value = false;
  x.value = 0
  y.value = 0
}

const target = ref()

onClickOutside(target, () => {
  show.value = false;
  x.value = 0
  y.value = 0
})

</script>

<template>
  <div class="relative w-full" @contextmenu.prevent="onClick" @click="onClick" ref="target">
    <div class="bg-slate-100 border border-slate-300 p-1 rounded-md flex flex-col gap-2">
      <div class="flex gap-2 items-center justify-between">
        <div class="flex items-center gap-2">
          <UAvatar size="sm" :src="formatImage(chat.sender.profilePicture)" :alt="chat.sender.name.toUpperCase()" />
          <div class="font-bold">{{ chat.sender.name }}</div>
        </div>
        <div class="text-xs">{{ formatDate(chat.createdAt, "DD-MM-YYYY, HH:mm") }}</div>
      </div>
      <div class="flex w-full justify-end " v-if="chat.replyChat">
        <div class="flex flex-col gap-2 w-[calc(100%-2rem)] bg-gray-300 p-1.5 rounded">
          <div class="text-sm font-['Roboto']">replied to</div>
          <div class="flex gap-2 items-center justify-between ">
            <div class="flex items-center gap-1 ">
              <UAvatar size="sm" :src="formatImage(chat.sender.profilePicture)" :alt="chat.sender.name.toUpperCase()" />
              <div class="font-bold">{{ chat.sender.name }}</div>
            </div>
            <div class="text-xs">{{ formatDate(chat.createdAt, "DD-MM-YYYY, HH:mm") }}</div>
          </div>
          <div v-html="chat.replyChat.content" class="bg-slate-200 p-1 rounded px-2 w-full"></div>
        </div>
      </div>
      <div v-html="chat.content" class="bg-slate-200 p-1 rounded px-2"></div>
    </div>
    <div class="absolute border bg-slate-100  rounded-sm p-2 z-50" :style="{
      top: `${y}px`,
      left: `${x}px`
    }" v-if="show && x !== 0 && y !== 0">
      <UButton label="Reply" @click="onClickReply" color="black" class="rounded-sm px-4" />
    </div>
  </div>
</template>

<style scoped></style>

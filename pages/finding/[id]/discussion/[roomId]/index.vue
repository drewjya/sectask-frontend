<script lang="ts" setup>
import { isApiError } from '~/types/api/error';
import type { Chat, RoomChat, RoomChatDetail } from '~/types/data/finding/finding';
import { ROOM_ACTION, ROOM_EVENT } from '~/types/enum/event.enum';


const route = useRoute()
const { id, roomId } = route.params

const roomDetail = ref<RoomChat>()
const chats = ref<Chat[]>()
const api = usePrivateApi()
const notif = useNotification()
const loading = ref(true)
const replyChat = ref<Chat>()
const store = findingStore()

const app = useApp()
const socket = useSocket()
onBeforeRouteLeave(() => {
  store.$reset()

})

watch(() => store.name, () => {
  updateNav()
})
watch(() => store.subproject, () => {
  updateNav()
})

const updateNav = () => {
  const id = store.id
  const name = store.name
  const subproject = store.subproject
  if (id && name && subproject) {
    app.navbarLink = [{
      label: subproject.project.name,
      to: `/project/${subproject.project.id}`
    },
    {
      label: subproject.name,
      to: `/subproject/${subproject.id}`
    },
    {
      label: name,
      to: `/finding/${id}`
    },]
  } else {
    app.navbarLink = []
  }
}
onMounted(async () => {
  store.id = Number(route.params.id)
  updateNav()
  try {
    const data = await api.get<RoomChatDetail>(
      `/finding/${id}/chats/${roomId}`
    );
    if (data.data) {
      roomDetail.value = {
        title: data.data.title,
        createdAt: new Date(data.data.createdAt),
        createdBy: data.data.createdBy,
        findingId: data.data.findingId,
        id: data.data.id,
      }
      chats.value = data.data.chats
      chats.value.forEach((e) => {
        e.createdAt = new Date(e.createdAt);
        if (e.replyChat) {
          e.replyChat.createdAt = new Date(e.replyChat.createdAt);
        }
      });

    }
  } catch (error) {
    if (isApiError(error)) {
      if (error.message === "unauthorized") {
      } else {
        notif.error({
          message: error.message,
        });
      }
    } else {
      notif.error({
        message: "Try Again Later",
      });
    }
  } finally {
    loading.value = false;
  }
  const conn = await socket.getConnection()
  conn.emit(ROOM_ACTION.JOIN, JSON.stringify({ roomId: roomId }))
  conn.on(ROOM_EVENT.SEND, (chat: Chat) => {
    chat.createdAt = new Date(chat.createdAt)
    if (chat.replyChat) {
      chat.replyChat.createdAt = new Date(chat.replyChat.createdAt)
    }
    chats.value?.push(chat)
  })

})

const cancelReplyChat = () => {
  replyChat.value = undefined
}


const send = async () => {
  try {
    if (text.value === "" || !text.value) {
      notif.info({
        message: "Please write a comment",
      })
      return
    }

    let body
    if (replyChat.value) {
      body = {
        content: text.value,
        replyChatId: replyChat.value.id,
      }
    } else {
      body = {
        content: text.value,
      }
    }
    replyChat.value = undefined
    text.value = "<p></p>"
    const data = await api.post(
      `/finding/${id}/chats/${roomId}`,
      {
        body: body,
      }
    );
    if (data.data) {
      notif.ok({
        message: "Comment Added",
      })

    }
  } catch (error) {
    if (isApiError(error)) {
      if (error.message === "unauthorized") {
      } else {
        notif.error({
          message: error.message,
        });
      }
    } else {
      notif.error({
        message: "Try Again Later",
      });
    }
  }

}

const onReply = (value: Chat) => {
  replyChat.value = value
}

const text = ref<string>("<p></p>")

onBeforeRouteLeave(async () => {
  const conn = await socket.getConnection()
  conn.emit(ROOM_ACTION.LEAVE, { roomId: roomId })
  conn.off(ROOM_EVENT.SEND)
})
</script>

<template>
  <div class="flex flex-col  h-full overflow-y-auto pb-64">
    <div class="p-4 flex  items-center gap-2" v-if="roomDetail">
      <div class="flex flex-col">
        <div class="font-bold text-2xl">
          {{ roomDetail.title }}
        </div>
        <div class="text-sm">
          <span>#{{ `${roomDetail.id}${roomDetail.findingId}` }}</span> opened at
          <span>{{ formatDate(roomDetail.createdAt, 'DD MMM,YYYY HH: mm') }}</span>
        </div>
      </div>
      <div class="text-sm flex items-center gap-1">
        <UAvatar size="sm" :src="formatImage(roomDetail.createdBy.profilePicture)"
          :alt="roomDetail.createdBy.name.toUpperCase()" />
        <div class="font-bold">{{ roomDetail.createdBy.name }}</div>
      </div>
    </div>
    <UDivider />
    <div class="p-2 flex flex-col gap-2" v-if="chats">
      <ChatItem v-for="i in chats" :chat="i" @reply="onReply" />
    </div>

    <div class="flex flex-col">

      <BasicEditor v-model="text" />
      <div v-if="replyChat" class="pl-8 pb-2 relative pr-4">
        <div class="absolute right-4">
          <UButton icon="material-symbols:close-rounded" class="rounded-full text-red-900" size="sm" :variant="'link'"
            @click="cancelReplyChat" />
        </div>
        <div class="bg-zinc-100 border border-slate-300 p-1 rounded-md flex flex-col gap-1">
          <div class="text-sm font-['Roboto']">replied to</div>
          <div class="flex gap-2 items-center ">
            <UAvatar size="sm" :src="formatImage(replyChat.sender.profilePicture)"
              :alt="replyChat.sender.name.toUpperCase()" />
            <div class="font-bold">{{ replyChat.sender.name }}</div>
          </div>
          <div v-html="replyChat.content" class="bg-slate-200 p-1 rounded px-2"></div>
        </div>
      </div>
      <div class="flex justify-end px-2">
        <UButton label="Comment" @click="send" color="black" class="rounded w-32 justify-center"
          :disabled="text === '<p></p>'" />
      </div>
    </div>
  </div>

</template>

<style scoped></style>

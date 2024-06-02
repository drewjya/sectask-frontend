<script lang="ts" setup>
import type { TestingDetail } from '~/types/data/finding/finding';


const emits = defineEmits(['close'])

const store = findingStore()

const props = defineProps<{
  testId: number
  findingId: number
}>()

const loading = ref(true)

const text = ref('<p></p>')
const version = ref()
const selectedStatus = ref()


const onClose = () => {
  emits('close')
}

const notif = useNotification()
const app = useApp()
const api = usePrivateApi()

onMounted(async () => {
  try {
    const data = await api.get<TestingDetail>(`/finding/retest/${props.findingId}/${props.testId}`)
    if (data.status < 400 && data.data) {
      text.value = data.data?.content
      version.value = data.data?.version
      selectedStatus.value = data.data?.status
    }
  } catch (error) {

  }
})



</script>

<template>
  <USlideover :ui="{
    width: 'max-w-[80vw] ',
    background: 'bg-slate-50 dark:bg-gray-950'
  }">
    <div class="flex flex-col h-screen gap-2">
      <div class="p-4 flex  justify-between items-center gap-2 bg-slate-50 dark:bg-gray-950">
        <div class="font-bold text-2xl">
          Test
        </div>
        <UButton icon="material-symbols:close" variant="ghost" color="red" @click="onClose" />
      </div>
      <UDivider />
      <div class="flex-grow  overflow-y-auto bg-slate-50 dark:bg-gray-950 pb-64 ">
        <div class="flex flex-col px-3 gap-2">
          <div class="flex items-center gap-1 ">
            <UAvatar size="xl" :src="formatImage(app.user?.profilePicture)" :alt="app.user?.name.toUpperCase()" />
            <div class="font-bold">{{ app.user?.name }}</div>
          </div>
          <div class="grid grid-cols-2 items-center w-72">
            <div class="text-sm font-semibold font-['Roboto']">Status</div>
            <USelectMenu :options="store.statusList" placeholder="Select Status" v-model="selectedStatus" size="xs"
              :disabled="true" />
          </div>
          <div class="grid grid-cols-2 w-72">
            <div class="text-sm font-semibold font-['Roboto']">Version</div>
            <UInput placeholder="Current Version" v-model="version" size="xs" :disabled="true" />
          </div>

          <BasicEditor v-model="text" :not-editable="true" />


        </div>

      </div>

    </div>
  </USlideover>
</template>

<style scoped></style>

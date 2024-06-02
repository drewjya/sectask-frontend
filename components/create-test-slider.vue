<script lang="ts" setup>
import { isApiError } from '~/types/api/error';
import ConfirmationModal from './confirmation-modal.vue';

const emits = defineEmits(['close'])
const modal = useModal()
const store = findingStore()

const text = ref('<p></p>')

const selectedStatus = ref()
const version = ref()

const onClose = () => {
  modal.open(ConfirmationModal, {
    title: 'Cancel Test',
    cancelLabel: 'No',
    confirmLabel: 'Yes',
    message: 'Are you sure you want to cancel new test?',
    onYes: () => {
      modal.close()
      emits('close')
    },
    onNo: () => {
      modal.close()
    }
  })
}

const notif = useNotification()
const app = useApp()
const api = usePrivateApi()
const send = async () => {
  try {
    if (text.value === "" || !text.value || !selectedStatus.value || !version.value) {
      notif.info({
        message: "Please fill all the field",
      })
      return
    }
    const data = await api.post(
      `/finding/retest/${store.id}`,
      {
        body: {
          status: selectedStatus.value,
          version: version.value,
          content: text.value,
        },
      }
    );
    if (data.status < 400) {
      emits('close')
      notif.ok({
        message: "Testing Added",
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
</script>

<template>
  <USlideover :ui="{
    width: 'max-w-[80vw] ',
    background: 'bg-slate-50 dark:bg-gray-950'
  }" prevent-close>
    <div class="flex flex-col h-screen gap-2">
      <div class="p-4 flex  justify-between items-center gap-2 bg-slate-50 dark:bg-gray-950">
        <div class="font-bold text-2xl">
          Create New Test
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
            <USelectMenu :options="store.statusList" placeholder="Select Status" v-model="selectedStatus" size="xs" />
          </div>
          <div class="grid grid-cols-2 w-72">
            <div class="text-sm font-semibold font-['Roboto']">Version</div>
            <UInput placeholder="Current Version" v-model="version" size="xs" />
          </div>

          <BasicEditor v-model="text" />

          <div class="flex justify-end px-2">
            <UButton label="Send" @click="send" color="black" class="rounded w-32 justify-center"
              :disabled="text === '<p></p>'" />
          </div>
        </div>

      </div>

    </div>
  </USlideover>
</template>

<style scoped></style>

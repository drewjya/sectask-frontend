<script lang="ts" setup>
import { isApiError } from '~/types/api/error';


const emits = defineEmits(['close']);
const props = defineProps<{
  subprojectId: number;
}>();

const onClose = () => {
  emits('close');
}
const api = usePrivateApi()
const loading = ref(false)

const onSubmit = async () => {
  try {
    await api.post(`/finding/new/${props.subprojectId}`,)
    notif.ok({ message: 'Project created' })
    onClose()
  } catch (error) {
    if (isApiError(error)) {
      notif.error({ message: error.message })

    } else {
      notif.error({ message: 'Please try again later', title: 'Error' })
    }
  }
}

const notif = useNotification()

</script>

<template>
  <UModal @close="() => onClose()">

    <UCard class="w-full" :ui="{
      header: { padding: 'px-8 py-4 sm:px-8 sm:py-4' },
      body: { padding: 'px-8 py-4 sm:px-8 sm:py-4' },
    }">
      <template #header>
        <div class="flex w-full items-center gap-2">
          <span class="text-2xl font-bold">
            Create Finding
          </span>
        </div>
      </template>

      <template #default>
        <div class="mb-8">
          <p class="w-full text-center text-lg font-semibold">
            Are you sure you want to create new finding?
          </p>
        </div>
        <div class="flex items-center justify-center gap-6">
          <div class="grow">
            <UButton label="Yes" type="button" block variant="solid" class="mt-2" @click="onSubmit()" />
          </div>
          <div class="grow">
            <UButton label="No" color="primary" variant="soft" block @click="onClose()" />
          </div>
        </div>





      </template>
    </UCard>

  </UModal>
</template>

<style scoped></style>

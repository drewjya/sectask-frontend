<script lang="ts" setup>
import { z } from 'zod';
import { isApiError } from '~/types/api/error';


const emits = defineEmits(['close']);
const props = defineProps<{
  findingId: number;
}>();

const onClose = () => {
  emits('close');
}
const api = usePrivateApi()
const loading = ref(false)

const formD = useForm({
  schema: z.object({
    title: z.string({ required_error: 'Title is required' }),
  }),

  onSubmit: async (form) => {
    try {
      await api.post(`/finding/${props.findingId}/discussions`, {
        body: {
          title: form.data.title,
        }
      })
      notif.ok({ message: 'New Discussion created' })
      onClose()
    } catch (error) {
      if (isApiError(error)) {
        notif.error({ message: error.message })

      } else {
        notif.error({ message: 'Please try again later', title: 'Error' })
      }
    }

  }
})
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
            Create New Discussion
          </span>
        </div>
      </template>

      <template #default>
        <Vform :form="formD">

          <section class="flex w-full flex-col gap-4">
            <section class="flex w-full flex-col">
              <span class="text-base font-bold">Title</span>
              <UFormGroup name="title" class="mt-2 w-full">
                <UInput placeholder="Untitled" v-model="formD.state.title" />
              </UFormGroup>
            </section>

            <UButton label="Submit" type="button" block variant="solid" class="mt-2" @click="formD.submit.value" />
          </section>
        </Vform>
      </template>
    </UCard>

  </UModal>
</template>

<style scoped></style>

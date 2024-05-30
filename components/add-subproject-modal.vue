<script lang="ts" setup>
import dayjs from 'dayjs';
import { z } from 'zod';
import { isApiError } from '~/types/api/error';


const emits = defineEmits(['close']);
const props = defineProps<{
  projectId: number;
}>();

const onClose = () => {
  emits('close');
}
const api = usePrivateApi()
const loading = ref(false)

const formD = useForm({
  schema: z.object({
    name: z.string({ required_error: 'Name is required' }),
    range: z.object({
      start: z.date({ required_error: 'Start date is required' }),
      end: z.date({ required_error: 'End date is required' }),
    }),

  }),
  initial: {

    range: {
      start: dayjs().startOf('day').toDate(),
      end: dayjs().startOf('day').add(1, 'day').toDate(),
    }
  },
  onSubmit: async (form) => {
    try {
      await api.post('/subproject/new', {
        body: {
          name: form.data.name,
          startDate: form.data.range.start,
          endDate: form.data.range.end,
          projectId: props.projectId,
        }
      })
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
            Create Project
          </span>
        </div>
      </template>

      <template #default>
        <Vform :form="formD">

          <section class="flex w-full flex-col gap-4">
            <section class="flex w-full flex-col">
              <span class="text-base font-bold">Title</span>
              <UFormGroup name="name" class="mt-2 w-full">
                <UInput placeholder="Untitled" v-model="formD.state.name" />
              </UFormGroup>
            </section>

            <section class="flex w-full flex-col">
              <span class="text-base font-bold">Active Period</span>
              <UFormGroup name="range" class="mt-2 w-full">
                <RangeDatePicker v-model="formD.state.range" :min-date="$dayjs().startOf('day').toDate()" color="white"
                  variant="solid" />
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

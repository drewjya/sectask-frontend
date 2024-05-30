<script lang="ts" setup>
import { z } from 'zod';
import { isApiError } from '~/types/api/error';



const api = usePrivateApi()
const emit = defineEmits(['close'])
const notif = useNotification()
const passwordForm = useForm({
  schema: z.object({
    oldPassword: z
      .string({ required_error: "Old Password Required" })
      .max(100, "Max 100")
      .trim(),
    newPassword: z
      .string({ required_error: "New Password Required" })
      .max(100, "Max 100")
      .trim(),
  }),
  onSubmit: async (form) => {
    try {
      await api.post(
        '/auth/change_password',
        {
          body: {
            oldPassword: form.data.oldPassword,
            newPassword: form.data.newPassword,
          }
        },
      );
      notif.ok({ message: 'Password Changed' });

    } catch (error) {
      if (isApiError(error)) {
        notif.error({ message: error.message, title: "Failed" });
      } else {
        notif.error({ message: "Try again later", title: "Failed" });
      }
    }

    onClose()
  },
});
function onClose() {
  emit('close')
}</script>

<template>
  <UModal :prevent-close="passwordForm.isLoading.value" @close="() => onClose()">
    <UCard>
      <!-- header -->
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">
            Password
          </h3>
          <UButton variant="ghost" icon="i-heroicons-x-mark-20-solid" :padded="false"
            :disabled="passwordForm.isLoading.value" @click="onClose()" />
        </div>
      </template>

      <!-- body -->
      <template #default>
        <Vform :form="passwordForm" class="flex w-full flex-col items-center justify-center gap-6">
          <UFormGroup class="w-full" label="Current Password" name="oldPassword">
            <UInput v-model="passwordForm.state.oldPassword" :disabled="passwordForm.isLoading.value"
              placeholder="*****" icon="i-heroicons-lock-closed" type="password" autofocus />
          </UFormGroup>

          <UFormGroup class="w-full" label="New Password" name="newPassword">
            <UInput v-model="passwordForm.state.newPassword" :disabled="passwordForm.isLoading.value"
              placeholder="*****" type="password" icon="i-heroicons-lock-closed" />
          </UFormGroup>

        </Vform>
        <UButton label="Save" class="mt-6" @click="passwordForm.submit.value" />
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>

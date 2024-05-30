<script lang="ts" setup>

import { z } from 'zod';
import ChangePasswordModal from '~/components/change-password-modal.vue';
import LogoutModal from '~/components/logout-modal.vue';
import PictureModal from '~/components/picture-modal.vue';
import { isApiError } from '~/types/api/error';


const fileUrl = useRuntimeConfig().public.FILE_URL
const app = useApp()

const api = usePrivateApi()
const auth = useAuth()
onMounted(() => {
  app.navbarLink = [{
    label: 'Setting',
    to: '/setting'

  }]
})

const notif = useNotification()
const form = useForm({
  schema: z.object({
    email: z.string({
      required_error: 'Email is required'
    }).max(100, "Email max 100 characters").trim().email(),
    name: z.string({
      required_error: 'Name is required'
    }).max(100, "Name max 100 characters").trim(),
  }),
  onSubmit: async (form) => {
    try {
      await api.put('/auth/profile', {
        body: form.data
      })
      notif.ok({
        title: 'Success',
        message: 'Profile updated'
      })

      auth.refreshToken()
    } catch (error) {
      if (isApiError(error)) {
        notif.error({
          title: 'Failed',
          message: error.message
        })
      } else {
        notif.error({
          title: 'Failed',
          message: 'Failed to update profile. Please try again later.'
        })
      }


    }

  },
  initial: {
    email: app.user?.email,
    name: app.user?.name
  },
  onError: async (err) => {
    console.log(err);

  }
})

const modal = useModal()

const changePassword = () => {
  modal.open(ChangePasswordModal, {
    onClose: () => {
      modal.close()
    }
  })
}

const logout = () => {
  modal.open(LogoutModal, {
    onClose: () => {
      modal.close()
    }
  })
}
const uploadImage = async () => {
  modal.open(PictureModal, {
    onSuccess: () => {
      modal.close()
    }
  })
}
</script>

<template>
  <div class="flex flex-col grow overflow-y-auto p-4 gap-4">
    <div class="grouping flex flex-col gap-3">
      <div class="title px-4">Account</div>

      <hr>
      <vform class="px-4 flex flex-col gap-4" :form="form">

        <div class="flex justify-between items-center">
          <UAvatar :alt="app.user?.name.toUpperCase()" size="xl"
            :src="app.user?.profilePicture ? `${fileUrl}${app.user.profilePicture.name}` : undefined" />
          <UButton label="Change" variant="outline" color="blue" @click="() => uploadImage()" />
        </div>
        <SettingItem label="Email" subtitle="Account's email address">
          <UInput icon="i-heroicons-envelope" class="w-48" v-model="form.state.email" />
        </SettingItem>
        <SettingItem label="Name" subtitle="Account's display name">
          <UInput class="w-48" v-model="form.state.name" />
        </SettingItem>

        <div class="flex justify-end">
          <UButton label="Save" variant="solid" color="blue" @click="form.submit.value" />
        </div>
      </vform>
    </div>
    <div class="grouping flex flex-col gap-3">
      <div class="title px-4">General</div>

      <hr>
      <div class="px-4 flex flex-col gap-6">

        <SettingItem label="Dark Mode" subtitle="Toggle darmode appearance">
          <UToggle v-model="app.isDark" />
        </SettingItem>
        <SettingItem label="Password" subtitle="Change account password">
          <UButton variant="outline" size="xs" color="blue" @click="() => changePassword()">Change</UButton>
        </SettingItem>
        <SettingItem label="Logout" subtitle="Logout from this devices">
          <UButton icon="i-heroicons-arrow-left-end-on-rectangle" variant="soft" size="xs" color="blue"
            @click="logout()">Logout
          </UButton>
        </SettingItem>
        <SettingItem label="Delete" subtitle="Delete account permanently" class="text-red-600"
          labelClass="text-red-600">
          <UButton icon="i-heroicons-trash" variant="soft" size="xs" color="red">Delete</UButton>
        </SettingItem>

      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-size: 1.5rem;
  font-weight: 600;


}

.grouping {
  padding: 1rem;
}
</style>

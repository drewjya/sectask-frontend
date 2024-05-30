<script lang="ts" setup>
import { isApiError } from '~/types/api/error';


const props = defineProps<{
  projectId: number
}>()

const emits = defineEmits(['close'])
const onClose = () => {
  emits('close')
}

const notif = useNotification()
const api = usePrivateApi()
const loading = ref(false)
type UserSearch = {
  email: string,
  id: number,
  name: string
}
const selected = ref<UserSearch>()
const app = useApp()
const store = projectStore(app.user?.id ?? -1)()

const inviteMembers = async () => {
  let cerr = 0
  for (const iterator of members.value) {
    try {
      await api.post(`/project/${props.projectId}/member`, {
        body: {
          userId: iterator.userId,
          role: iterator.role
        }
      })
    } catch (error) {
      cerr += 1
      if (isApiError(error)) {
        notif.error({ message: error.message })
      } else {
        notif.error({ message: 'Try again later' })
        break;
      }
    }
  }
  if (cerr === 0) {
    notif.ok({ message: 'Members added successfully' })
  }
  onClose()

}

const search = async (query: string) => {
  if (!store.project) {
    return []
  }

  loading.value = true;
  const users = await api.get<UserSearch[]>(`/project/member?email=${query}`)
  console.log(users);
  loading.value = false

  const datas = users.data ?? []
  return datas.filter(i => !store.project?.members.find(j => j.id === i.id)).filter(i => !members.value.find(j => j.userId === i.id))

}

const members = ref<{
  userId: number;
  email: string;
  role: Role;
}[]>([])

function updateRoleAt(index: number, role: Role) {
  members.value[index].role = role;
}
function removeInviteAt(index: number) {
  members.value.splice(index, 1);
}

const addMember = () => {
  if (!selected.value) {
    notif.info({ message: 'Please select a user' })
    return;
  }
  members.value.push({
    userId: selected.value.id,
    email: selected.value.email,
    role: Role.VIEWER,
  })
  selected.value = undefined
}


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
            Invite New Members
          </span>
        </div>
      </template>

      <template #default>
        <section class="flex w-full flex-col gap-4">


          <div class="flex w-full flex-col">
            <span class="text-base font-bold">Members</span>
            <section class="flex w-full items-start gap-2">
              <UFormGroup name="email" class="mt-2 w-full">
                <UInputMenu icon="i-heroicons-envelope" placeholder="name@email.com" :loading="loading" :search="search"
                  option-attribute="email" trailing by="id" v-model="selected" />
              </UFormGroup>
              <UButton color="white" variant="solid" type="button" label="Add" icon="i-heroicons-plus" class="mt-2"
                @click="addMember" />
            </section>

            <div class="mt-3 h-56 max-h-56 w-full flex-col overflow-y-auto rounded-md border border-gray-200">
              <template v-if="!members || members.length === 0">
                <div class="flex size-full items-center justify-center">
                  <section class="flex flex-col items-center justify-center opacity-70">
                    <UIcon name="i-heroicons-no-symbol" class="text-6xl" />
                    <span class="text-base font-semibold">Empty</span>
                    <span class="text-sm">Add members by email, or skip this step.</span>
                  </section>
                </div>
              </template>
              <template v-else>
                <div v-for="(invite, index) in members" :key="invite.email"
                  class="group flex w-full items-center justify-between border-b border-gray-200 px-4 py-1">
                  <span class="text-sm font-medium">{{ invite.email }}</span>

                  <UDropdown :items="[[
                    {
                      label: 'Viewer',
                      icon: 'i-heroicons-user',
                      click: () => updateRoleAt(index, Role.VIEWER),
                    },
                    {
                      label: 'Developer',
                      icon: 'i-heroicons-code-bracket',
                      click: () => updateRoleAt(index, Role.DEVELOPER),
                    },
                    {
                      label: 'Writer',
                      icon: 'i-heroicons-pencil',
                      click: () => updateRoleAt(index, Role.TECHNICAL_WRITER),
                    },
                    {
                      label: 'Remove',
                      icon: 'i-heroicons-x-circle',
                      click: () => removeInviteAt(index),
                    },
                  ]]" :popper="{ placement: 'right' }">
                    <UButton color="white" :label="roleLabel(invite.role)" variant="ghost"
                      trailing-icon="i-heroicons-chevron-down-20-solid" size="xs" />
                  </UDropdown>
                </div>
              </template>
            </div>
          </div>

          <UButton label="Submit" type="submit" block variant="solid" class="mt-2" @click="() => inviteMembers()" />
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>

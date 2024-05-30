<script lang="ts" setup>
import { isApiError } from '~/types/api/error';
import type { ProjectMember } from '~/types/data/project/project';
import MemberModal from './member-modal.vue';

const props = defineProps<{
  members: ProjectMember[],
  canInvite: boolean
  isSubproject: boolean,
  docId: number
}>()
const api = usePrivateApi()
const notif = useNotification()

const getDropdownItem = (value: ProjectMember) => {
  if (value.role === Role.CONSULTANT) {
    return [[{
      label: roleLabel(Role.VIEWER),
      icon: roleIcon(Role.VIEWER),
      click: async () => {
        try {

          await api.post(`/subproject/${props.docId}/viewer/${value.id}`)
        } catch (error) {
          if (isApiError(error)) {
            return notif.error({ message: error.message })
          } else {
            return notif.error({ message: 'Try again later' })
          }
        }
      }
    }]]
  } else if (value.role === Role.VIEWER) {

    return [[{
      label: roleLabel(Role.CONSULTANT),
      icon: roleIcon(Role.CONSULTANT),
      click: async () => {
        try {
          await api.post(`/subproject/${props.docId}/consultant/${value.id}`)

        } catch (error) {
          if (isApiError(error)) {
            return notif.error({ message: error.message })
          } else {
            return notif.error({ message: 'Try again later' })
          }
        }
      }
    }]]
  }
  return [[]]
}
const modal = useModal()
const openInviteMember = () => {
  modal.open(MemberModal, {
    projectId: props.docId,
    onClose: () => {
      modal.close()
    }

  })
}

</script>

<template>
  <div class="px-2 flex flex-col gap-2">
    <div class="flex justify-between px-2">
      <div class="text-lg font-bold font-['DM Sans']">Members</div>
      <UButton v-if="canInvite && !isSubproject" label="Invite" icon="i-heroicons-user-plus" size="sm" color="white"
        @click="() => openInviteMember()" variant="solid" />
    </div>
    <div class="grid grid-cols-2 px-2 gap-2 text-sm font-bold font-['DM Sans'] place-items-start">
      <div class="col-span-1">
        <div>Profile</div>
      </div>
      <div class="col-span-1">
        <div>Role</div>
      </div>
    </div>

    <div class="grid grid-cols-2 bg-white rounded-md border py-4 px-2 font-['DM Sans'] gap-2" v-for="i in members">
      <div class="col-span-1 flex items-center gap-2">
        <UAvatar :alt="i?.name.toUpperCase()" />
        <div class="text-[#64748B] text-sm capitalize">{{ i?.name }}</div>
      </div>
      <div class="col-span-1 flex items-center gap-2">

        <UDropdown :items="getDropdownItem(i)" :popper="{ placement: 'right' }"
          :disabled="[Role.DEVELOPER, Role.PM, Role.TECHNICAL_WRITER].includes(i.role) || !isSubproject || !canInvite">
          <UButton class="w-full" color="gray" :label="roleLabel(i.role)" variant="ghost" :icon="roleIcon(i.role)"
            size="md" />
        </UDropdown>

      </div>
    </div>




  </div>
</template>

<style scoped></style>

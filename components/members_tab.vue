<script lang="ts" setup>
import type { ProjectMember } from '~/types/data/project/project';

const props = defineProps<{
  members: ProjectMember[]
}>()

</script>

<template>
  <div class="px-2 flex flex-col gap-2">
    <div class="flex justify-between px-2">
      <div class="text-lg font-bold font-['DM Sans']">Members</div>
      <UButton label="Invite" icon="i-heroicons-user-plus" size="sm" color="white" variant="solid" />
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
        <UButton class="w-full" color="gray" :label="roleLabel(i.role)" variant="ghost" :icon="roleIcon(i.role)"
          size="md" />
        <!-- :trailing-icon="authority.userCanOpearteMember ? 'i-heroicons-chevron-down-20-solid' : undefined" -->
      </div>
    </div>




  </div>
</template>

<style scoped></style>

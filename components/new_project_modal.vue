<script lang="ts" setup>
import dayjs from 'dayjs';


const emits = defineEmits(['close']);

const onClose = () => {
  emits('close');
}

const range = ref({
  start: dayjs().startOf('day').toDate(),
  end: dayjs().startOf('day').add(1, 'day').toDate(),
})
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
        <section class="flex w-full flex-col gap-4">
          <section class="flex w-full flex-col">
            <span class="text-base font-bold">Title</span>
            <UFormGroup name="name" class="mt-2 w-full">
              <UInput placeholder="Untitled" />
            </UFormGroup>
          </section>

          <section class="flex w-full flex-col">
            <span class="text-base font-bold">Active Period</span>
            <UFormGroup name="range" class="mt-2 w-full">
              <RangeDatePicker v-model="range" :min-date="$dayjs().startOf('day').toDate()" color="white"
                variant="solid" />
            </UFormGroup>
          </section>

          <section class="flex w-full flex-col">
            <span class="text-base font-bold">Members</span>
            <section class="flex w-full items-start gap-2">
              <UFormGroup name="email" class="mt-2 w-full">
                <UInput icon="i-heroicons-envelope" placeholder="name@email.com" />
              </UFormGroup>
              <UButton color="white" variant="solid" type="submit" label="Add" icon="i-heroicons-plus" class="mt-2" />
            </section>

            <div class="mt-3 h-56 max-h-56 w-full flex-col overflow-y-auto rounded-md border border-gray-200">
              <template v-if="true">
                <div class="flex size-full items-center justify-center">
                  <section class="flex flex-col items-center justify-center opacity-70">
                    <UIcon name="i-heroicons-no-symbol" class="text-6xl" />
                    <span class="text-base font-semibold">Empty</span>
                    <span class="text-sm">Add members by email, or skip this step.</span>
                  </section>
                </div>
              </template>
              <!-- <template v-else>
                <div v-for="(invite, index) in projectModal.form.invites" :key="invite.email"
                  class="group flex w-full items-center justify-between border-b border-gray-200 px-4 py-1">
                  <span class="text-sm font-medium">{{ invite.email }}</span>

                  <UDropdown :items="[[
                    {
                      label: 'Member',
                      icon: 'i-heroicons-user',
                      click: () => projectModal.updateRoleAt(index, 'MEMBER'),
                    },
                    {
                      label: 'Developer',
                      icon: 'i-heroicons-code-bracket',
                      click: () => projectModal.updateRoleAt(index, 'DEVELOPER'),
                    },
                    {
                      label: 'Writer',
                      icon: 'i-heroicons-pencil',
                      click: () => projectModal.updateRoleAt(index, 'TECHNICAL_WRITER'),
                    },
                    {
                      label: 'Remove',
                      icon: 'i-heroicons-x-circle',
                      click: () => projectModal.removeInviteAt(index),
                    },
                  ]]" :popper="{ placement: 'right' }" :disabled="projectModal.isSubmitting">
                    <UButton color="white" :label="roleDisplayOf(invite.role)" variant="ghost"
                      trailing-icon="i-heroicons-chevron-down-20-solid" size="xs" />
                  </UDropdown>
                </div>
              </template> -->
            </div>
          </section>

          <UButton label="Submit" type="submit" block variant="solid" class="mt-2" />
        </section>
      </template>
    </UCard>

  </UModal>
</template>

<style scoped></style>

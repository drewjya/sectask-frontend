<script lang="ts" setup>
import AddSubprojectModal from './add-subproject-modal.vue';
const app = useApp()
const store = projectStore(app.user?.id ?? -1)()
const project = computed(() => store.project);

const modal = useModal()
const addSubproject = () => {

  modal.open(AddSubprojectModal, {
    projectId: project.value?.id ?? -1,
    onClose: () => {
      modal.close()
    }
  })
}
</script>

<template>
  <div v-if="project" class="px-2 flex flex-col gap-2 ">
    <div class="flex justify-between px-2">
      <div class="text-lg font-bold font-['DM Sans']">Subprojects</div>
      <UButton label="Add" icon="i-heroicons-plus" size="sm" color="white" variant="solid" @click="addSubproject"
        v-if="store.myrole === Role.PM" />
    </div>
    <div class="grid grid-cols-8 px-2 gap-2 text-sm font-bold font-['DM Sans'] place-items-start">
      <div class="col-span-2">
        <div>Subproject</div>
      </div>
      <div class="col-span-2">
        <div>Status</div>
      </div>
      <div class="col-span-3">
        <div>Period</div>
      </div>
      <div class="col-span-1">
        <div>Action</div>
      </div>
    </div>
    <SubprojectTabItem v-for="i in project.subProjects" :name="i.name" :startDate="i.startDate" :endDate="i.endDate"
      :id="i.id" :deletable="true" />

  </div>
</template>

<style scoped></style>

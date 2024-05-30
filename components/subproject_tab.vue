<script lang="ts" setup>
import AddSubprojectModal from './add-subproject-modal.vue';
const app = useApp()
const store = projectStore(app.user?.id ?? -1)()
  ;

const modal = useModal()
const addSubproject = () => {

  modal.open(AddSubprojectModal, {
    projectId: store.id ?? -1,
    onClose: () => {
      modal.close()
    }
  })
}

const canEdit = computed(() => store.myrole === Role.PM)
</script>

<template>
  <div v-if="!store.loading" class="px-2 flex flex-col gap-2 ">
    <div class="flex justify-between px-2">
      <div class="text-lg font-bold font-['DM Sans']">Subprojects</div>
      <UButton label="Add" icon="i-heroicons-plus" size="sm" color="white" variant="solid" @click="addSubproject"
        v-if="canEdit" />
    </div>
    <div class=" px-2 gap-2 text-sm font-bold font-['DM Sans'] place-items-start"
      :class="canEdit ? 'grid grid-cols-8' : 'grid grid-cols-7'">
      <div class="col-span-2">
        <div>Subproject</div>
      </div>
      <div class="col-span-2">
        <div>Status</div>
      </div>
      <div class="col-span-3">
        <div>Period</div>
      </div>
      <div class="col-span-1" v-if="canEdit">
        <div>Action</div>
      </div>
    </div>
    <div v-if="store.loading || !store.subprojects"></div>
    <div v-else class="flex flex-col gap-2">

      <SubprojectTabItem v-for="i in store.subprojects" :name="i.name" :startDate="i.startDate" :endDate="i.endDate"
        :id="i.id" :deletable="canEdit" />
    </div>

  </div>
</template>

<style scoped></style>

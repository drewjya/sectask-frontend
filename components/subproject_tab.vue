<script lang="ts" setup>
import dayjs from "dayjs";
import AddSubprojectModal from "./add-subproject-modal.vue";
const app = useApp();
const store = projectStore(app.user?.id ?? -1)();
const modal = useModal();
const addSubproject = () => {
  modal.open(AddSubprojectModal, {
    projectId: store.id ?? -1,
    startDate: store.range?.start ?? new Date(),
    minDate: dayjs().subtract(10, "day").toDate(),
    maxDate: dayjs().add(10, "day").toDate(),
    onClose: () => {
      modal.close();
    },
  });
};

const canEdit = computed(() => store.myrole === Role.PM);
</script>

<template>
  <div v-if="!store.loading" class="px-2 flex flex-col gap-2">
    <div class="flex justify-between px-2">
      <div class="text-lg font-bold font-['DM Sans']">Subprojects</div>
      <UButton
        label="Add"
        icon="i-heroicons-plus"
        size="sm"
        color="white"
        variant="solid"
        @click="addSubproject"
        v-if="canEdit"
      />
    </div>
    <div
      class="px-2 gap-2 text-sm font-bold font-['DM Sans'] place-items-start"
      :class="canEdit ? 'grid grid-cols-8' : 'grid grid-cols-7'"
    >
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
    <div v-else-if="store.subprojects?.length === 0">
      <div
        class="bg-white dark:bg-gray-800 rounded-md min-h-40 flex justify-center items-center py-4 px-2 font-['DM Sans'] text-[#64748B] text-sm"
      >
        No Subprojects
      </div>
    </div>
    <div v-else class="flex flex-col gap-2">
      <SubprojectTabItem
        v-for="i in store.subprojects"
        :name="i.name"
        :startDate="i.startDate"
        :endDate="i.endDate"
        :id="i.id"
        :deletable="canEdit"
      />
    </div>
  </div>
</template>

<style scoped></style>

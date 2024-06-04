<script lang="ts" setup>
import dayjs from "dayjs";
import AddFindingModal from "./add-finding-modal.vue";

const app = useApp();
const store = subprojectStore(app.user?.id ?? -1)();

const modal = useModal();

const addFindings = () => {
  modal.open(AddFindingModal, {
    subprojectId: store.id ?? -1,
    onClose: () => {
      modal.close();
    },
  });
};
const isOnRange = computed(
  () => store.range.end >= dayjs().startOf("date").toDate()
);

const consultantPrivilege = computed(
  () => store.myrole === Role.CONSULTANT && isOnRange.value
);
const pmPrivilege = computed(() => store.myrole === Role.PM);
</script>

<template>
  <div class="px-2 flex flex-col gap-2">
    <div class="flex justify-between px-2">
      <div class="text-lg font-bold font-['DM Sans']">Findings</div>
      <UButton
        label="Add"
        icon="i-heroicons-plus"
        size="sm"
        color="white"
        variant="solid"
        v-if="consultantPrivilege"
        @click="addFindings()"
      />
    </div>
    <div
      class="grid px-2 gap-2 text-sm font-bold font-['DM Sans'] place-items-start"
      :class="
        consultantPrivilege || pmPrivilege ? 'grid-cols-9' : 'grid-cols-8'
      "
    >
      <div class="col-span-2">
        <div>Findings</div>
      </div>
      <div class="col-span-2">
        <div>Created By</div>
      </div>
      <div class="col-span-2">
        <div>Risk</div>
      </div>
      <div class="col-span-2">
        <div>Status</div>
      </div>
      <div class="col-span-1" v-if="consultantPrivilege || pmPrivilege">
        <div>Action</div>
      </div>
    </div>
    <div v-if="store.loading && !store.findings"></div>
    <div v-else-if="store.findings?.length === 0">
      <div
        class="bg-white dark:bg-gray-800 dark:text-white rounded-md min-h-40 flex justify-center items-center py-4 px-2 font-['DM Sans'] text-[#64748B] text-sm"
      >
        No findings
      </div>
    </div>
    <div v-else class="flex flex-col gap-3">
      <FindingsTabItem
        v-for="i in store.findings"
        :finding="i"
        :deletable="consultantPrivilege"
        :approvedDelete="pmPrivilege"
      />
    </div>
  </div>
</template>

<style scoped></style>

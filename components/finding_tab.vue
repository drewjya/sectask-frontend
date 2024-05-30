<script lang="ts" setup>


const store = subprojectStore()
const subproject = computed(() => store.subproject);
const app = useApp()

</script>

<template>
  <div v-if="subproject" class="px-2 flex flex-col gap-2 ">
    <div class="flex justify-between px-2">
      <div class="text-lg font-bold font-['DM Sans']">Findings</div>
      <UButton label="Add" icon="i-heroicons-plus" size="sm" color="white" variant="solid" />
    </div>
    <div class="grid grid-cols-9 px-2 gap-2 text-sm font-bold font-['DM Sans'] place-items-start">
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
      <div class="col-span-1">
        <div>Action</div>
      </div>
    </div>
    <FindingsTabItem v-for="i in subproject.findings" :name="i.name" :createdBy="i.createdBy" :risk="'asjsaj'"
      :id="i.id" :deletable="true" :status="'ashsah'" />



  </div>
</template>

<style scoped></style>

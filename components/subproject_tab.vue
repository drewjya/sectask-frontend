<script lang="ts" setup>
const store = projectStore()
const project = computed(() => store.project);


</script>

<template>
  <div v-if="project" class="px-2 flex flex-col gap-2">
    <div class="grid grid-cols-8 px-2 gap-2">
      <div class="col-span-2">
        <div>Name</div>
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

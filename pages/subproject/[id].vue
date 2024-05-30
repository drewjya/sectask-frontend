<script lang="ts" setup>

const store = subprojectStore()
const route = useRoute()
const app = useApp()
onMounted(() => {
  store.currentTab = 0;
  store.id = Number(route.params.id)
  const subproject = store.subproject
  if (subproject != undefined) {
    app.navbarLink = [{
      label: subproject.project.name,
      to: `/project/${subproject.project.id}`
    },
    {
      label: subproject.name,
      to: `/subproject/${subproject.id}`
    }]
  } else {
    app.navbarLink = []
  }
})

watch(() => store.subproject, () => {
  const subproject = store.subproject
  if (subproject != undefined) {
    app.navbarLink = [{
      label: subproject.project.name,
      to: `/project/${subproject.project.id}`
    },
    {
      label: subproject.name,
      to: `/subproject/${subproject.id}`
    }]
  } else {
    app.navbarLink = []
  }
})




const fileUrl = useRuntimeConfig().public.FILE_URL
</script>

<template>
  <div v-if="store.subproject" class="flex flex-col grow h-full">
    <Header :end-date="store.subproject?.endDate" :start-date="store.subproject.startDate"
      :project-manager="store.pm?.name ?? '-'" :id="store.subproject.id" :name="store.subproject.name"
      :my-role="store.myrole ? roleLabel(store.myrole) : '-'" />
    <div class="px-8 flex flex-col h-full grow overflow-auto">
      <UTabs v-model="store.currentTab" :items="store.tabs" :ui="{ wrapper: 'space-y-4', }">
      </UTabs>

      <div class="grow h-full overflow-y-auto">
        <template v-if="store.loading">
          <div class="flex size-full items-center justify-center" data-role="loader">
            <USkeleton class=" size-full flex flex-col items-center justify-center opacity-70" />
          </div>
        </template>
        <template v-else>
          <section class="size-full flex-grow">
            <template v-if="store.currentTab === 0">
              <FindingTab />
            </template>
            <template v-else-if="store.currentTab === 1">
              <MembersTab :members="store.subproject.subprojectMember" />
            </template>
            <template v-else-if="store.currentTab === 2">
              <AttachmentsTab :attachments="store.subproject.attachments" :reports="store.subproject.reports" />
            </template>
            <template v-else-if="store.currentTab === 3">
              <LogsTab :logs="store.subproject.recentActivities" />
            </template>
          </section>
        </template>
      </div>


    </div>

  </div>
</template>

<style scoped></style>

<script lang="ts" setup>

const store = subprojectStore()
const route = useRoute()
const app = useApp()
onMounted(() => {
  store.id = Number(route.params.id)
})

watch(() => store.subproject, async (subproject) => {
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
  <div v-if="store.subproject">
    <Header :end-date="store.subproject?.endDate" :start-date="store.subproject.startDate"
      :project-manager="store.pm?.name ?? '-'" :id="store.subproject.id" :name="store.subproject.name"
      :my-role="store.myrole ? roleLabel(store.myrole) : '-'" />
    <div class="px-8">
      <UTabs v-model="store.currentTab" :items="store.tabs" class="size-full flex flex-col flex-grow"
        :ui="{ wrapper: 'space-y-4', container: 'h-full', base: 'size-full' }">
        <template #item="{ item }">
          <div class="size-full">
            <template v-if="store.loading">
              <div class="flex size-full items-center justify-center" data-role="loader">
                <USkeleton class=" size-full flex flex-col items-center justify-center opacity-70" />
              </div>
            </template>
            <template v-else>
              <section class="size-full flex-grow">
                <template v-if="item.label === 'Findings'">
                  <FindingTab />
                </template>
                <template v-else-if="item.label === 'Members'">
                  <MembersTab :members="store.subproject.subprojectMember" />
                </template>
                <template v-else-if="item.label === 'Reports & Attachments'">
                  <AttachmentsTab :attachments="store.subproject.attachments" :reports="store.subproject.reports" />
                </template>
                <template v-else-if="item.label === 'Updates'">
                  <LogsTab :logs="store.subproject.recentActivities" />
                </template>
              </section>
            </template>
          </div>
        </template>
      </UTabs>

    </div>

  </div>
</template>

<style scoped></style>

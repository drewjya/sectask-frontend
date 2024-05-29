<script lang="ts" setup>
import { projectStore } from '~/stores/project_store';


const route = useRoute()
const store = projectStore()
const app = useApp()
onMounted(() => {
  store.id = Number(route.params.id)
})

watch(() => store.project, async (project) => {
  if (project != undefined) {
    app.navbarLink = [{
      label: project.name,
      to: `/project/${project.id}`
    }]
  } else {
    app.navbarLink = []
  }
})

const fileUrl = useRuntimeConfig().public.FILE_URL

</script>

<template>
  <div v-if="store.project">
    <Header :end-date="store.project?.endDate" :start-date="store.project.startDate"
      :image="store.project.projectPicture ? `${fileUrl}${store.project.projectPicture.name}` : undefined"
      :project-manager="store.pm?.name ?? '-'" :id="store.project.id" :name="store.project.name"
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
                <template v-if="item.label === 'Projects'">
                  <SubprojectTab />
                </template>
                <template v-else-if="item.label === 'Members'">
                  <MembersTab :members="store.project.members" />
                </template>
                <template v-else-if="item.label === 'Reports & Attachments'">
                  <AttachmentsTab :attachments="store.project.attachments" :reports="store.project.reports" />
                </template>
                <template v-else-if="item.label === 'Updates'">
                  <LogsTab :logs="store.project.recentActivities" />
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

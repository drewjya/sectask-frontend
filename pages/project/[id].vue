<script lang="ts" setup>
import { projectStore } from '~/stores/project_store';


const route = useRoute()
const store = projectStore()
const app = useApp()
onMounted(() => {
  store.currentTab = 0;
  store.id = Number(route.params.id)
  const project = store.project
  if (project != undefined) {
    app.navbarLink = [{
      label: project.name,
      to: `/project/${project.id}`
    }]
  } else {
    app.navbarLink = []
  }
})



watch(() => store.project, () => {
  console.log(store.project);

  const project = store.project
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
  <div v-if="store.project" class="flex flex-col h-full pb-4 ">
    <Header :end-date="store.project?.endDate" :start-date="store.project.startDate"
      :image="store.project.projectPicture ? `${fileUrl}${store.project.projectPicture.name}` : undefined"
      :project-manager="store.pm?.name ?? '-'" :id="store.project.id" :name="store.project.name"
      :my-role="store.myrole ? roleLabel(store.myrole) : '-'" />

    <div class="px-8  grow   overflow-auto">
      <div class="flex flex-col h-full">

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
              <template v-if="!route.query.tab || `${$route.query.tab}`.startsWith('subproject')">
                <SubprojectTab />
              </template>
              <template v-else-if="`${$route.query.tab}`.startsWith('members')">
                <MembersTab :members="store.project.members" />
              </template>
              <template v-else-if="`${$route.query.tab}`.startsWith('reports')">
                <AttachmentsTab :attachments="store.project.attachments" :reports="store.project.reports" />
              </template>
              <template v-else-if="`${$route.query.tab}`.startsWith('updates')">
                <LogsTab :logs="store.project.recentActivities" />
              </template>
            </section>
          </template>
        </div>
      </div>


    </div>

  </div>
</template>

<style scoped></style>

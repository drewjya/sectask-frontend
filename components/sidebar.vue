<script lang="ts" setup>
import type { FindingSidebar, ProjectSidebar, SubprojectSidebar } from '~/types/data/sidebar/project';

const app = useApp()

const projectList = ref<{
  project: ProjectSidebar,
  expanded: boolean,
}[]>([])
const loading = ref(true)
const api = usePrivateApi()
const initState = async () => {
  try {
    const projects = await api.get<ProjectSidebar[]>("/project/sidebar")
    projectList.value = (projects.data ?? []).map(i => ({ project: i, expanded: false, subproject: [] }))
  } catch (error) {
    projectList.value = []
  }
  loading.value = false;

}

onMounted(() => {
  initState()
})

watch(() => app.sidebar, () => {
  if (app.sidebar) {
    initState()
  } else {
    projectList.value = []

  }
})

const fileUrl = useRuntimeConfig().public.FILE_URL

const clickProject = async (project: {
  project: ProjectSidebar,
  expanded: boolean,
}, index: number) => {
  if (!project.expanded) {
    try {
      const subproject = await api.get<SubprojectSidebar[]>(`/project/sidebar/${project.project.id}`)
      projectList.value[index].project.subproject = (subproject.data ?? []).map(i => ({ id: i.id, name: i.name, expanded: false, findings: [] }))
    } catch (error) {

    }
  }
  projectList.value[index].expanded = !project.expanded
}


const clickSubProject = async (param: {
  subproject: SubprojectSidebar,
  index: number
  indexSubproject: number
},) => {
  if (!param.subproject.expanded) {
    try {
      const subproject = await api.get<FindingSidebar[]>(`/project/sidebar/subproject/${param.subproject.id}`)
      projectList.value[param.index].project.subproject[param.indexSubproject].findings = subproject.data ?? []

    } catch (error) {

    }
  }
  projectList.value[param.index].project.subproject[param.indexSubproject].expanded = !param.subproject.expanded
}

</script>

<template>
  <div class="bg-[#f1f5f9] transition-all py-8 pt-4 flex flex-col gap-1" :class="app.sidebar ? 'w-72 ' : 'w-0'">
    <div class="flex gap-2 items-center py-2 px-4">
      <UAvatar size="lg" :alt="app.user?.name.toUpperCase()" v-if="app.sidebar"
        :src="app.user?.profilePicture?.name ? `${fileUrl}${app.user.profilePicture.name}` : undefined">
      </UAvatar>
      <p class="uppercase font-['Lato'] font-semibold text-sm text-ellipsis line-clamp-1">{{ app.user?.name }}</p>
    </div>
    <hr>

    <div class="flex flex-col px-2" v-if="app.sidebar">
      <UButton label="Search" icon="i-heroicons-magnifying-glass" variant="ghost" size="xs" color="gray" />
      <UButton label="Home" icon="i-heroicons-home" variant="ghost" size="xs" color="gray" @click="$router.push('/')"
        :class="$route.path === '/' ? 'cursor-not-allowed ' : ''" :disable="$route.path === '/'" />
      <UButton label="Setting" icon="i-heroicons-pencil-square" variant="ghost" size="xs" color="gray" />
      <UButton label="Add Project" icon="i-heroicons-plus-circle" variant="ghost" size="xs" color="gray" />
    </div>
    <hr>

    <div v-if="loading"></div>
    <div v-else class=" px-2">

      <div v-for="(i, index) in projectList" class="flex flex-col ">
        <div class="flex items-center">
          <UButton icon="i-heroicons-chevron-right-16-solid" variant="ghost" size="xs" color="gray"
            class="transition-all hover:bg-transparent border-0 focus-visible:ring-inset focus-visible:!ring-0 "
            :class="i.expanded ? 'rotate-90' : 'rotate-0'" @click="() => clickProject(i, index)" />
          <UButton :label="i.project.name" variant="ghost" size="xs" color="gray" icon="i-heroicons-folder-solid"
            @click="$router.push(`/project/${i.project.id}`)" />
        </div>
        <div v-if="i.expanded && i.project.subproject">
          <div class="flex flex-col pl-5" v-for="(sub, subIn) in i.project.subproject">

            <div class="flex items-center">
              <UButton icon="i-heroicons-chevron-right-16-solid" variant="ghost" size="xs" color="gray"
                class="transition-all hover:bg-transparent border-0 focus-visible:ring-inset focus-visible:!ring-0 "
                :class="sub.expanded ? 'rotate-90' : 'rotate-0'" @click="() => clickSubProject({
                  index: index,
                  indexSubproject: subIn,
                  subproject: sub
                })" />
              <UButton :label="sub.name" variant="ghost" size="xs" color="gray" icon="i-heroicons-folder-solid"
                @click="$router.push(`/subproject/${sub.id}`)" />
            </div>
            <div v-if="sub.expanded && sub.findings">
              <div class="flex flex-col pl-7" v-for="(find, subIn) in sub.findings">
                <div class="flex items-center">

                  <UButton variant="ghost" size="xs" color="gray" icon="i-heroicons-document-solid"
                    @click="$router.push(`/finding/${find.id}`)">
                    <div class="text-ellipsis line-clamp-1 w-24">
                      {{ find.name }} + 'asjhasj sahshah ashash' shdshdsh
                    </div>
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import type {
  FindingSidebar,
  ProjectSidebar,
  SubprojectSidebar,
} from "~/types/data/sidebar/project";
import {
  FINDING_EVENT,
  PROJECT_EVENT,
  SUBPROJECT_EVENT,
} from "~/types/enum/event.enum";
import NewProjectModal from "./new-project-modal.vue";

const app = useApp();
const router = useRouter();

type EventSidebarProjectItem = {
  project: {
    projectId: number;
    name: string;
  };
  type: string;
};

export type EventSidebarSubprojectItem = {
  projectId: number;
  subproject: {
    subprojectId: number;
    name: string;
  };
  type: string;
};

export type EventSidebarFindingItem = {
  projectId: number;
  subprojectId: number;
  finding: {
    findingId: number;
    name: string;
  };
  type: string;
};

const projectList = ref<
  {
    project: ProjectSidebar;
    expanded: boolean;
  }[]
>([]);
const loading = ref(true);
const api = usePrivateApi();
const socket = useSocket();
const route = useRoute();
const initState = async () => {
  try {
    const projects = await api.get<ProjectSidebar[]>("/project/sidebar");
    projectList.value = (projects.data ?? []).map((i) => ({
      project: i,
      expanded: false,
      subproject: [],
    }));
    const conn = await socket.getConnection();
    conn.off(PROJECT_EVENT.SIDEBAR);
    conn.off(SUBPROJECT_EVENT.SIDEBAR);
    conn.off(FINDING_EVENT.SIDEBAR);

    conn.on(PROJECT_EVENT.SIDEBAR, (val: EventSidebarProjectItem) => {
      if (val.type === "add") {
        projectList.value.push({
          expanded: false,
          project: {
            id: val.project.projectId,
            name: val.project.name,
            subproject: [],
          },
        });
      } else if (val.type === "remove") {
        projectList.value = projectList.value.filter(
          (i) => i.project.id !== val.project.projectId
        );
      } else if (val.type === "edit") {
        for (const iterator of projectList.value) {
          if (iterator.project.id === val.project.projectId) {
            iterator.project.name = val.project.name;
            break;
          }
        }
      }
    });
    conn.on(SUBPROJECT_EVENT.SIDEBAR, (val: EventSidebarSubprojectItem) => {
      const projectIndex = projectList.value.findIndex(
        (i) => i.project.id === val.projectId
      );
      if (projectIndex === -1) {
        return;
      }
      console.log(route.fullPath);

      if (val.type === "add") {
        projectList.value[projectIndex].project.subproject.push({
          id: val.subproject.subprojectId,
          name: val.subproject.name,
          expanded: false,
          findings: [],
        });
      } else if (val.type === "remove") {
        if (projectList.value[projectIndex]?.project) {
          if (projectList.value[projectIndex].project.subproject) {
            projectList.value[projectIndex].project.subproject =
              projectList.value[projectIndex].project.subproject.filter(
                (i) => i.id !== val.subproject.subprojectId
              );
          }
        }
      } else if (val.type === "edit") {
        if (!projectList.value[projectIndex].project.subproject) {
          return;
        }
        for (const iterator of projectList.value[projectIndex].project
          .subproject) {
          if (iterator.id === val.subproject.subprojectId) {
            iterator.name = val.subproject.name;
            break;
          }
        }
      }
    });
    conn.on(FINDING_EVENT.SIDEBAR, (val: EventSidebarFindingItem) => {
      console.log(val);
      const projectIndex = projectList.value.findIndex(
        (i) => i.project.id === val.projectId
      );
      if (projectIndex === -1) {
        return;
      }
      const subprojectIndex =
        projectList.value[projectIndex].project.subproject?.findIndex(
          (i) => i.id === val.subprojectId
        ) ?? -1;
      if (subprojectIndex === -1) {
        return;
      }
      if (val.type === "add") {
        projectList.value[projectIndex].project.subproject[
          subprojectIndex
        ].findings.push({
          id: val.finding.findingId,
          name: val.finding.name,
        });
      } else if (val.type === "remove") {
        projectList.value[projectIndex].project.subproject[
          subprojectIndex
        ].findings = projectList.value[projectIndex].project.subproject[
          subprojectIndex
        ].findings.filter((i) => i.id !== val.finding.findingId);
      } else if (val.type === "edit") {
        for (const iterator of projectList.value[projectIndex].project
          .subproject[subprojectIndex].findings) {
          if (iterator.id === val.finding.findingId) {
            iterator.name = val.finding.name;
            break;
          }
        }
      }
    });
  } catch (error) {
    projectList.value = [];
  }
  loading.value = false;
};

onMounted(() => {
  initState();
});

watch(
  () => app.sidebar,
  () => {
    if (app.sidebar) {
      initState();
    } else {
      projectList.value = [];
    }
  }
);

const fileUrl = useRuntimeConfig().public.FILE_URL;

const clickProject = async (
  project: {
    project: ProjectSidebar;
    expanded: boolean;
  },
  index: number
) => {
  if (!project.expanded) {
    try {
      const subproject = await api.get<SubprojectSidebar[]>(
        `/project/sidebar/${project.project.id}`
      );
      projectList.value[index].project.subproject = (subproject.data ?? []).map(
        (i) => ({ id: i.id, name: i.name, expanded: false, findings: [] })
      );
    } catch (error) {}
  }
  projectList.value[index].expanded = !project.expanded;
};

const clickSubProject = async (param: {
  subproject: SubprojectSidebar;
  index: number;
  indexSubproject: number;
}) => {
  if (!param.subproject.expanded) {
    try {
      const subproject = await api.get<FindingSidebar[]>(
        `/project/sidebar/subproject/${param.subproject.id}`
      );
      projectList.value[param.index].project.subproject[
        param.indexSubproject
      ].findings = subproject.data ?? [];
    } catch (error) {}
  }
  projectList.value[param.index].project.subproject[
    param.indexSubproject
  ].expanded = !param.subproject.expanded;
};

const modal = useModal();

const addProject = () => {
  modal.open(NewProjectModal, {
    onClose: () => {
      modal.close();
    },
  });
};
</script>

<template>
  <div
    class="bg-gray-100 dark:bg-gray-800 transition-all py-8 pt-4 flex flex-col gap-1"
    :class="app.sidebar ? 'w-72 ' : 'w-0'"
  >
    <div class="flex gap-2 items-center py-2 px-4">
      <UAvatar
        size="lg"
        :alt="app.user?.name.toUpperCase()"
        v-if="app.sidebar"
        :src="
          app.user?.profilePicture?.name
            ? `${fileUrl}${app.user.profilePicture.name}`
            : undefined
        "
      >
      </UAvatar>
      <p
        class="uppercase font-['Lato'] font-semibold text-sm text-ellipsis line-clamp-1"
      >
        {{ app.user?.name }}
      </p>
    </div>
    <UDivider :ui="{ border: { base: 'dark:border-gray-700' } }" />

    <div class="flex flex-col px-2" v-if="app.sidebar">
      <UButton
        color="gray"
        label="Search"
        icon="i-heroicons-magnifying-glass"
        variant="ghost"
        size="sm"
        class="justify-start text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400"
      />
      <UButton
        label="Home"
        icon="i-heroicons-home"
        variant="ghost"
        size="sm"
        class="justify-start text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400"
        color="gray"
        @click="$router.push('/')"
        :class="$route.path === '/' ? 'cursor-not-allowed ' : ''"
        :disable="$route.path === '/'"
      />
      <UButton
        label="Setting"
        icon="i-heroicons-pencil-square"
        variant="ghost"
        size="sm"
        class="justify-start text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400"
        color="gray"
        @click="$router.push('/setting')"
      />
      <UButton
        label="Add Project"
        icon="i-heroicons-plus-circle"
        variant="ghost"
        size="sm"
        class="justify-start text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400"
        color="gray"
        @click="() => addProject()"
      />
    </div>
    <UDivider :ui="{ border: { base: 'dark:border-gray-700' } }" />

    <div v-if="loading"></div>
    <div v-else class="px-2 max-h-50 overflow-y-auto">
      <div v-for="(i, index) in projectList" class="flex flex-col">
        <div class="flex items-center">
          <UButton
            icon="i-heroicons-chevron-right-16-solid"
            variant="ghost"
            size="sm"
            color="gray"
            class="transition-all hover:bg-transparent border-0 focus-visible:ring-inset focus-visible:!ring-0"
            :class="i.expanded ? 'rotate-90' : 'rotate-0'"
            @click="() => clickProject(i, index)"
          />
          <UButton
            :label="i.project.name"
            variant="ghost"
            size="sm"
            color="gray"
            icon="i-heroicons-folder-solid"
            @click="$router.push(`/project/${i.project.id}`)"
          />
        </div>
        <div v-if="i.expanded && i.project.subproject">
          <div
            class="flex flex-col pl-5"
            v-for="(sub, subIn) in i.project.subproject"
          >
            <div class="flex items-center">
              <UButton
                icon="i-heroicons-chevron-right-16-solid"
                variant="ghost"
                size="sm"
                color="gray"
                class="transition-all hover:bg-transparent border-0 focus-visible:ring-inset focus-visible:!ring-0"
                :class="sub.expanded ? 'rotate-90' : 'rotate-0'"
                @click="
                  () =>
                    clickSubProject({
                      index: index,
                      indexSubproject: subIn,
                      subproject: sub,
                    })
                "
              />
              <UButton
                :label="sub.name"
                variant="ghost"
                size="sm"
                color="gray"
                icon="i-heroicons-folder-solid"
                @click="$router.push(`/subproject/${sub.id}`)"
              />
            </div>
            <div v-if="sub.expanded && sub.findings">
              <div
                class="flex flex-col pl-7"
                v-for="(find, subIn) in sub.findings"
              >
                <div class="flex items-center">
                  <UButton
                    variant="ghost"
                    size="sm"
                    color="gray"
                    icon="i-heroicons-document-solid"
                    class="justify-start"
                    @click="$router.push(`/finding/${find.id}`)"
                  >
                    <div class="text-ellipsis line-clamp-1 w-24 text-start">
                      {{ find.name }}
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

<script lang="ts" setup>
import type { VFile } from "~/types/data/file";

const auth = useAuth();
const app = useApp();
const api = usePrivateApi();
const projectLoading = ref(false);
const projects = ref<ProjectActive[]>();
const logs = ref<RecentActivities[]>();
onMounted(() => {
  app.navbarLink = [];
  Promise.all([activeProject(), recentUpdates()]);
});

enum DocType {
  PROJECT = "PROJECT",
  SUBPROJECT = "SUBPROJECT",
}

type RecentActivities = {
  title: string;
  documentId: number;
  description: string;
  createdAt: Date;
  type: DocType;
};
type ProjectActive = {
  id: number;
  owner: {
    name: string;
    email: string;
    profilePicture?: VFile;
  };
  name: string;
  projectPicture?: VFile;
  archived: boolean;
  startDate: Date;
  endDate: Date;
};

const activeProject = async () => {
  const res = await api.get<ProjectActive[]>("/project/active");
  projects.value = res.data ?? [];
  if (projects.value) {
    projects.value.forEach((e) => {
      e.startDate = new Date(e.startDate);
      e.endDate = new Date(e.endDate);
    });
  }
};

const recentUpdates = async () => {
  const res = await api.get<RecentActivities[]>("/project/recent_updates");
  logs.value = res.data ?? [];
  if (logs.value) {
    logs.value.forEach((e) => {
      e.createdAt = new Date(e.createdAt);
    });
  }
};

const fileUrl = (file?: VFile) => {
  return file ? `${useRuntimeConfig().public.FILE_URL}${file.name}` : undefined;
};
</script>

<template>
  <div class="h-full flex flex-col gap-5 p-5">
    <div>
      <div class="font-bold text-lg font-['DM Sans']">Active Project</div>
      <div
        class="overflow-x-auto flex gap-2"
        :class="app.sidebar ? 'w-[calc(100vw-20rem)]' : 'w-full'"
      >
        <NuxtLink
          :to="`/project/${i.id}`"
          class="flex flex-col gap-2 p-2 rounded bg-gray-100 dark:bg-slate-800"
          v-for="i in projects"
        >
          <div class="flex items-center gap-2">
            <UAvatar
              :alt="i.name.toUpperCase()"
              :src="fileUrl(i.projectPicture)"
              size="xl"
            />
            <div class="text-sm font-bold">{{ i.name }}</div>
          </div>
          <div class="text-xs w-max">
            {{ formatDate(i.startDate, "DD MMM, YYYY") }} →
            {{ formatDate(i.endDate, "DD MMM, YYYY") }}
          </div>
          <div>
            <div class="text-xs flex gap-2 items-center w-max">
              <UAvatar
                :alt="i.owner.name.toUpperCase()"
                :src="fileUrl(i.owner.profilePicture)"
                size="sm"
              />
              <div class="line-clamp-2">{{ i.owner.name }}</div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div>
      <div class="font-bold text-lg font-['DM Sans']">Recent Updates</div>
      <div
        class="flex flex-col gap-2"
        :class="app.sidebar ? 'w-[calc(100vw-20rem)]' : 'w-full'"
      >
        <NuxtLink
          :to="`/${i.type.toLowerCase()}/${i.documentId}`"
          class="flex flex-col gap-0.5 p-2 rounded bg-gray-200 dark:bg-slate-800"
          v-for="i in logs"
        >
          <div class="text-base font-bold">{{ i.title }}</div>

          <div class="text-xs w-max" v-html="i.description"></div>
          <div>
            <div class="text-xs flex gap-2 items-center w-full justify-end">
              <div>{{ formatDate(i.createdAt, "DD MMM, YYYY") }}</div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import type { ProjectActive } from "~/types/api/response";

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
</script>

<template>
  <div class="h-full flex flex-col gap-5 p-5">
    <div>
      <div class="font-bold text-lg font-['DM Sans']">Active Project</div>
      <div
        class="overflow-x-auto flex gap-2"
        :class="app.sidebar ? 'w-[calc(100vw-20rem)]' : 'w-full'"
        v-if="projects"
      >
        <!-- <NuxtLink
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
        </NuxtLink> -->
        <NuxtLink
          :to="`/project/${i.id}`"
          v-for="i in projects"
          class="flex gap-2 bg-gray-200 dark:bg-slate-700 p-2 px-4 rounded-2xl hover:bg-gray-300 dark:hover:bg-slate-800 items-center"
        >
          <UAvatar
            :src="fileUrl(i.projectPicture)"
            :alt="i.name.toUpperCase()"
            size="xl"
          />
          <div>
            <div class="font-bold text-lg">
              {{ i.name }}
            </div>
            <div class="text-xs w-max">
              {{ formatDate(i.startDate, "DD MMM, YYYY") }} →
              {{ formatDate(i.endDate, "DD MMM, YYYY") }}
            </div>
            <div>
              <div class="text-xs flex gap-2 items-center w-max">
                <div class="line-clamp-2 text-sm font-semibold">
                  PM : {{ i.owner.name }}
                </div>
              </div>
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
        <div
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

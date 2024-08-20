<script lang="ts" setup>
import type { ProjectActive } from "~/types/api/response";

const projects = ref<ProjectActive[]>([]);
const loading = ref(true);

const app = useApp();

const api = usePrivateApi();

onMounted(() => {
  app.navbarLink = [
    {
      label: "Archived",
      to: "/archived",
    },
  ];
});

const load = async () => {
  loading.value = true;
  const res = await api.get<ProjectActive[]>("/project/archived");
  projects.value = res.data ?? [];

  if (projects.value) {
    projects.value.forEach((e) => {
      e.startDate = new Date(e.startDate);
      e.endDate = new Date(e.endDate);
    });
  }
  loading.value = false;
};

onMounted(() => {
  load();
});
</script>

<template>
  <div v-if="loading">
    <div class="p-4 h-full flex flex-col gap-3 w-full">
      <div
        class="flex gap-2 bg-gray-200 dark:bg-slate-700 p-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-800 items-start"
        v-for="i in 4"
      >
        <USkeleton class="rounded-full h-16 w-16"></USkeleton>
        <div class="flex flex-col gap-3">
          <USkeleton class="h-5 w-[20rem]"></USkeleton>
          <USkeleton class="h-3 w-[10rem]"></USkeleton>
          <USkeleton class="h-3 w-[5rem]"></USkeleton>
        </div>
      </div>
    </div>
  </div>
  <div class="p-4 h-full flex flex-col gap-3" v-else-if="projects">
    <NuxtLink
      :to="`/project/${i.id}`"
      v-for="i in projects"
      class="flex gap-2 bg-gray-200 dark:bg-slate-700 p-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-800 items-center"
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
</template>

<style scoped></style>

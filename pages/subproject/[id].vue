<script lang="ts" setup>

const store = subprojectStore()
const route = useRoute()
const app = useApp()
onMounted(() => {

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

const router = useRouter()


const currentTab = computed({
  get() {
    const index = tabs.findIndex((t) => t.key === route.query.tab);
    return index === -1 ? 0 : index;
  },
  set(value) {
    router.replace({
      query: { tab: tabs[value].key },
    });
  },
});
const tabs = [
  {
    label: "Findings",
    key: "findings",
  },
  {
    label: "Members",
    key: "members",
  },
  {
    label: "Reports & Attachments",
    key: "reports",
  },
  {
    label: "Updates",
    key: "updates",
  },
];


const fileUrl = useRuntimeConfig().public.FILE_URL
</script>

<template>
  <div v-if="store.subproject" class="flex flex-col grow h-full">
    <Header :end-date="store.subproject?.endDate" :start-date="store.subproject.startDate"
      :project-manager="store.pm?.name ?? '-'" :id="store.subproject.id" :name="store.subproject.name"
      :my-role="store.myrole ? roleLabel(store.myrole) : '-'" />
    <div class="px-8 flex flex-col h-full grow overflow-auto">
      <UTabs v-model="currentTab" :items="tabs" :ui="{
        wrapper: 'space-y-4',
        list: {
          width: 'w-full',
          tab: {
            size: 'text-xs'
          },
        },

      }">
      </UTabs>

      <div class="grow h-full overflow-y-auto">
        <template v-if="store.loading">
          <div class="flex size-full items-center justify-center" data-role="loader">
            <USkeleton class=" size-full flex flex-col items-center justify-center opacity-70" />
          </div>
        </template>
        <template v-else>
          <section class="size-full flex-grow">
            <template v-if="!route.query.tab || `${$route.query.tab}`.startsWith('findings')">
              <FindingTab />
            </template>
            <template v-else-if="`${$route.query.tab}`.startsWith('members')">
              <MembersTab :members="store.subproject.subprojectMember" :canInvite="store.myrole === Role.PM"
                :isSubproject="true" :doc-id="store.subproject.id" />
            </template>
            <template v-else-if="`${$route.query.tab}`.startsWith('reports')">
              <AttachmentsTab :attachments="store.subproject.attachments" :reports="store.subproject.reports"
                :myRole="store.myrole ?? Role.VIEWER" :docId="store.subproject.id" doctype="subproject" />
            </template>
            <template v-else-if="`${$route.query.tab}`.startsWith('updates')">
              <LogsTab :logs="store.subproject.recentActivities" />
            </template>
          </section>
        </template>
      </div>


    </div>

  </div>
</template>

<style scoped></style>

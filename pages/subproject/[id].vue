<script lang="ts" setup>

const route = useRoute()
const app = useApp()
const store = subprojectStore(app.user?.id ?? -1)()
onMounted(() => {

  if (store.id !== Number(route.params.id)) {
    store.watcher.ignoreUpdates(() => {
      store.id = Number(route.params.id)
    })

  } else {
    if (store.loading) {
      store.getSubproject()
    }
  }

  const id = store.id
  const name = store.name
  const project = store.project
  if (id && name && project) {
    app.navbarLink = [{
      label: project.name,
      to: `/project/${project.id}`
    },
    {
      label: name,
      to: `/subproject/${id}`
    }]
  } else {
    app.navbarLink = []
  }
})

onBeforeRouteLeave(() => {
  store.$reset()

})


watch(() => store.name, () => {
  const id = store.id
  const name = store.name
  const project = store.project
  if (id && name && project) {
    app.navbarLink = [{
      label: project.name,
      to: `/project/${project.id}`
    },
    {
      label: name,
      to: `/subproject/${id}`
    }]
  } else {
    app.navbarLink = []
  }
})
watch(() => store.project, () => {
  const id = store.id
  const name = store.name
  const project = store.project
  if (id && name && project) {
    app.navbarLink = [{
      label: project.name,
      to: `/project/${project.id}`
    },
    {
      label: name,
      to: `/subproject/${id}`
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

watch(() => store.error, () => {
  const err = store.error
  if (err && err !== "unauthorized") {
    router.push("/")
  }
})



const fileUrl = useRuntimeConfig().public.FILE_URL
</script>

<template>
  <div class="flex flex-col grow h-full">
    <Header v-model:range="store.range" v-model:name="store.name" :project-manager="store.pm?.name ?? '-'"
      :id="store.id ?? -1" :my-role="store.myrole ? roleLabel(store.myrole) : '-'"
      :userCanUpdateHeader="store.myrole === Role.PM" type="subproject" :loading="store.loading" :error="store.error" />
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

              <MembersTab :members="store.members" :canInvite="store.myrole === Role.PM" :isSubproject="true"
                :doc-id="store.id ?? -1" :loading="store.loading" />
            </template>
            <template v-else-if="`${$route.query.tab}`.startsWith('reports')">
              <AttachmentsTab :attachments="store.attachments" :reports="store.reports"
                :myRole="store.myrole ?? Role.VIEWER" :docId="store.id ?? -1" doctype="subproject"
                :loading="store.loading" />
            </template>
            <template v-else-if="`${$route.query.tab}`.startsWith('updates')">
              <LogsTab :logs="store.logs" :loading="store.loading" />
            </template>
          </section>
        </template>
      </div>


    </div>

  </div>
</template>

<style scoped></style>

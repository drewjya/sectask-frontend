<script lang="ts" setup>
import { projectStore } from '~/stores/project_store';


const router = useRouter()
const app = useApp()
const store = projectStore(app.user?.id ?? -1)()
const route = useRoute();
const tabs = [
  {
    label: "Projects",
    key: "subprojects",
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

onBeforeRouteLeave(() => {
  console.log("INIT");

  store.$reset()

})
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
onMounted(() => {

  if (store.id !== Number(route.params.id)) {
    store.watcher.ignoreUpdates(() => {
      store.id = Number(route.params.id)
    })
  } else {
    if (store.loading) {
      store.getProject()
    }
  }
  if (store.name && store.id) {
    app.navbarLink = [{
      label: store.name,
      to: `/project/${store.id}`
    }]
  } else {
    app.navbarLink = []
  }
})

watch(() => store.name, () => {
  if (store.name && store.id) {
    app.navbarLink = [{
      label: store.name,
      to: `/project/${store.id}`
    }]
  } else {
    app.navbarLink = []
  }
})

watch(() => store.error, () => {
  const err = store.error
  if (err && err !== "unauthorized") {
    router.push("/")
  }
})

watch(() => store.id, () => {


  if (store.name && store.id) {
    app.navbarLink = [{
      label: store.name,
      to: `/project/${store.id}`
    }]
  } else {
    app.navbarLink = []
  }
})

const fileUrl = useRuntimeConfig().public.FILE_URL



</script>

<template>
  <div class="flex flex-col h-full pb-4 ">
    <Header :image="store.picture ? `${fileUrl}${store.picture.name}` : undefined" :loading="store.loading"
      :project-manager="store.pm?.name ?? '-'" :id="store.id ?? -1" v-model:name="store.name"
      v-model:range="store.range" :my-role="store.myrole ? roleLabel(store.myrole) : '-'"
      :userCanUpdateHeader="store.myrole === Role.PM" type="project" :error="store.error" />

    <div class="px-8  grow   overflow-auto">
      <div class="flex flex-col h-full">

        <UTabs v-model="currentTab" :items="tabs" :ui="{
          wrapper: 'space-y-4',
          list: {
            tab: {
              size: 'text-xs'
            },
          },
        }">
        </UTabs>

        <div class="grow h-full overflow-auto">
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
                <MembersTab :members="store.members" :canInvite="store.myrole === Role.PM" :isSubproject="false"
                  :doc-id="store.id ?? -1" :loading="store.loading" />
              </template>
              <template v-else-if="`${$route.query.tab}`.startsWith('reports')">
                <AttachmentsTab :attachments="store.attachments" :reports="store.reports" :loading="store.loading"
                  :myRole="store.myrole ?? Role.VIEWER" :docId="store.id ?? -1" doctype="project" />
              </template>
              <template v-else-if="`${$route.query.tab}`.startsWith('updates')">
                <LogsTab :logs="store.logs" :loading="store.loading" />
              </template>
            </section>
          </template>
        </div>

      </div>


    </div>

  </div>
</template>

<style scoped></style>

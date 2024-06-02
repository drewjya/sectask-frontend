<script lang="ts" setup>

const store = findingStore()
const route = useRoute()
const app = useApp()

const updateNav = () => {
  const id = store.id
  const name = store.name
  const subproject = store.subproject
  if (id && name && subproject) {
    app.navbarLink = [{
      label: subproject.project.name,
      to: `/project/${subproject.project.id}`
    },
    {
      label: subproject.name,
      to: `/subproject/${subproject.id}`
    },
    {
      label: name,
      to: `/finding/${id}`
    },]
  } else {
    app.navbarLink = []
  }
}
const router = useRouter()
const tabs = [
  {
    label: "Document",
    key: "document",
  },
  {
    label: "CVSS",
    key: "cvss",
  },
  {
    label: "Discussion",
    key: "discussion",
  },
];
const currentTab = computed({
  get() {
    const index = tabs.findIndex((t) => t.key === route.query.tab);
    return index === -1 ? 0 : index;
  },
  set(value) {
    router.replace({
      query: { tab: tabs[value].key },
    });
    return value;
  },
});
onMounted(() => {

  store.id = Number(route.params.id)

  updateNav()
})

onBeforeRouteLeave(() => {
  store.$reset()

})

watch(() => store.name, () => {
  updateNav()
})
watch(() => store.subproject, () => {
  updateNav()
})



const loading = computed(() => store.loading);


</script>

<template>

  <div class="flex h-full w-full">
    <FindingLeft />
    <UDivider orientation="vertical" />
    <div class="flex-1  flex flex-col p-4 pb-6 ">
      <UTabs v-model="currentTab" :items="tabs" :ui="{ wrapper: 'space-y-4', }">
      </UTabs>

      <div class="h-full overflow-y-auto  flex flex-col grow">
        <template v-if="store.loading">
          <div class="flex size-full items-center justify-center" data-role="loader">
            <USkeleton class=" size-full flex flex-col items-center justify-center opacity-70" />
          </div>
        </template>
        <template v-else>
          <section class="grow h-full w-full overflow-x-auto">
            <template v-if="!$route.query.tab || `${$route.query.tab}`.startsWith('document')">
              <DocumentEditor />
            </template>
            <template v-else-if="`${$route.query.tab}`.startsWith('cvss')">
              <CvssEditor />
            </template>
            <template v-else-if="`${$route.query.tab}`.startsWith('discussion')">
              <Discussion />
            </template>

          </section>
        </template>

      </div>



    </div>

  </div>
</template>

<style scoped></style>

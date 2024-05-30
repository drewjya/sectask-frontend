<script lang="ts" setup>

const store = findingStore()
const route = useRoute()
const app = useApp()
onMounted(() => {
  store.currentTab = 0;
  store.id = Number(route.params.id)
  console.log(store.currentTab);


  const finding = store.finding
  if (finding != undefined) {
    app.navbarLink = [{
      label: finding?.subProject.project.name,
      to: `/project/${finding.subProject.project.id}`
    },
    {
      label: finding.subProject.name,
      to: `/subproject/${finding.subProject.id}`
    },
    {
      label: finding.name,
      to: `/finding/${finding.id}`
    },]
  } else {
    app.navbarLink = []
  }
})


watch(() => store.finding, () => {
  const finding = store.finding
  if (finding != undefined) {
    app.navbarLink = [{
      label: finding?.subProject.project.name,
      to: `/project/${finding.subProject.project.id}`
    },
    {
      label: finding.subProject.name,
      to: `/subproject/${finding.subProject.id}`
    },
    {
      label: finding.name,
      to: `/finding/${finding.id}`
    },]
  } else {
    app.navbarLink = []
  }
})

const loading = computed(() => store.loading);
const finding = computed(() => store.finding);


</script>

<template>
  <div class="flex  h-full ">
    <FindingLeft />
    <UDivider orientation="vertical" />
    <div class="grow p-3 pb-6 h-full flex flex-col" v-if="!loading && finding">
      <UTabs v-model="store.currentTab" :items="store.tabs" :ui="{ wrapper: 'space-y-4', }">
      </UTabs>

      <div class="h-full overflow-y-auto  flex flex-col grow">
        <template v-if="store.loading">
          <div class="flex size-full items-center justify-center" data-role="loader">
            <USkeleton class=" size-full flex flex-col items-center justify-center opacity-70" />
          </div>
        </template>
        <template v-else>
          <section class="size-full flex-grow h-full">
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

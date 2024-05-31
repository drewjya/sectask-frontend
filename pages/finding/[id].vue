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
onMounted(() => {
  store.currentTab = 0;
  store.id = Number(route.params.id)
  console.log(store.currentTab);

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
  <div class="flex  h-full ">
    <FindingLeft />
    <UDivider orientation="vertical" />
    <div class="grow p-3 pb-6 h-full flex flex-col">
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

<script lang="ts" setup>

const store = findingStore()
const route = useRoute()
const app = useApp()
onMounted(() => {
  store.id = Number(route.params.id)
})

watch(() => store.finding, async (finding) => {
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
</script>

<template>
  <div class="flex  h-screen ">
    <FindingLeft />
    <UDivider orientation="vertical" />
    <FindingRight />



  </div>
</template>

<style scoped></style>

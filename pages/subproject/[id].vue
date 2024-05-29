<script lang="ts" setup>


const route = useRoute()
const store = subprojectStore()
const app = useApp()
onMounted(() => {
  store.id = Number(route.params.id)
})

watch(() => store.subproject, async (subproject) => {
  if (subproject != undefined) {
    app.navbarLink = [{
      label: subproject.name,
      to: `/subproject/${subproject.id}`
    }]
  } else {
    app.navbarLink = []
  }
})

const fileUrl = useRuntimeConfig().public.FILE_URL</script>

<template>
  <div>
    Page: subproject/[id]
  </div>
</template>

<style scoped></style>

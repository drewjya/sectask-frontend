<script lang="ts" setup>
const auth = useAuth()
const app = useApp()

onMounted(() => {
  app.navbarLink = []

})
</script>

<template>
  <div class="bg-red-100 grow">

    <UButton @click="auth.logout">Logout</UButton>
  </div>
</template>

<style scoped></style>

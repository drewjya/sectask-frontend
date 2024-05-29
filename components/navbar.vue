<script lang="ts" setup>
const app = useApp()
</script>

<template>
  <div class="border-b py-1 flex gap-2 items-center">

    <UButton @click="app.sidebar = !app.sidebar" icon="i-heroicons-chevron-double-left-16-solid" variant="ghost"
      color="gray" class="hover:bg-transparent" />

    <div>

      <UBreadcrumb :links="app.navbarLink">
        <template #divider>
          <UIcon name="i-heroicons-chevron-right-20-solid" />
        </template>
      </UBreadcrumb>
    </div>
  </div>
</template>

<style scoped></style>

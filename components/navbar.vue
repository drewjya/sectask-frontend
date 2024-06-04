<script lang="ts" setup>
const app = useApp();
</script>

<template>
  <div class="border-b py-1 flex gap-2 items-center dark:border-gray-800">
    <UButton
      @click="() => app.setSidebarVal()"
      icon="i-heroicons-chevron-double-left-16-solid"
      variant="ghost"
      class="hover:bg-transparent transition-all dark:hover:bg-transparent"
      :class="app.sidebar ? 'rotate-0' : 'rotate-180'"
    />

    <div>
      <UBreadcrumb :links="app.navbarLink" color="gray">
        <template #divider>
          <UIcon name="i-heroicons-chevron-right-20-solid" />
        </template>
      </UBreadcrumb>
    </div>
  </div>
</template>

<style scoped></style>

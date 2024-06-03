<script lang="ts" setup>
import Navbar from "~/components/navbar.vue";
const app = useApp();
</script>

<template>
  <div class="flex h-screen w-screen">
    <Sidebar />
    <div
      class="flex flex-col flex-1 bg-[#f8fafc] dark:bg-[#020617] h-full overflow-hidden"
    >
      <Navbar />
      <div class="flex-1 overflow-hidden">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

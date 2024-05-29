<script lang="ts" setup>
import Navbar from '~/components/navbar.vue';


</script>

<template>
  <div class="flex h-screen ">
    <Sidebar />
    <div class="flex flex-col w-full gap-2 bg-[#f8fafc] h-screen  overflow-auto">
      <Navbar />
      <slot />
    </div>
  </div>
</template>

<style scoped></style>

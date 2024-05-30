<script lang="ts" setup>
import Navbar from '~/components/navbar.vue';


</script>

<template>
  <div class="flex h-screen ">
    <Sidebar />
    <div class="flex flex-col w-full  bg-[#f8fafc] h-full  ">
      <Navbar />
      <div class="grow overflow-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import Navbar from '~/components/navbar.vue';
const app = useApp()

</script>

<template>
  <div class="flex h-screen w-screen ">
    <Sidebar />
    <div class="flex flex-col grow  bg-[#f8fafc] h-full overflow-hidden ">
      <Navbar />
      <div class="grow  overflow-hidden">

        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
const store = findingStore()
const finding = computed(() => store.finding);
const loading = computed(() => store.loading);
</script>

<template>
  <div class="grow p-3 pb-6 h-full flex flex-col" v-if="!loading && finding">
    <UTabs v-model="store.currentTab" :items="store.tabs" class="" :ui="{ wrapper: 'space-y-4', }">
    </UTabs>
    <p>{{ $route.query.tab }}</p>
    <div class="h-full overflow-y-auto  flex flex-col grow">
      <template v-if="store.loading">
        <div class="flex size-full items-center justify-center" data-role="loader">
          <USkeleton class=" size-full flex flex-col items-center justify-center opacity-70" />
        </div>
      </template>
      <template v-else>
        <section class="size-full flex-grow h-full">
          <template v-if="$route.query.tab || `${$route.query.tab}`.startsWith('document')">
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
</template>

<style scoped></style>

<script lang="ts" setup>
const store = findingStore()
const finding = computed(() => store.finding);
const loading = computed(() => store.loading);
</script>

<template>
  <div class="grow  p-3" v-if="!loading && finding">

    <UTabs v-model="store.currentTab" :items="store.tabs" class="size-full flex flex-col flex-grow"
      :ui="{ wrapper: 'space-y-4', container: 'h-full', base: 'size-full' }">
      <template #item="{ item }">
        <div class="size-full">
          <template v-if="store.loading">
            <div class="flex size-full items-center justify-center" data-role="loader">
              <USkeleton class=" size-full flex flex-col items-center justify-center opacity-70" />
            </div>
          </template>
          <template v-else>
            <section class="size-full flex-grow">
              <template v-if="item.label === 'Document'">
                <DocumentEditor />
              </template>
              <template v-else-if="item.label === 'CVSS'">
                <CvssEditor />
              </template>
              <template v-else-if="item.label === 'Discussion'">
                <Discuession />
              </template>

            </section>
          </template>
        </div>
      </template>
    </UTabs>


  </div>
</template>

<style scoped></style>

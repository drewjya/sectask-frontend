<script lang="ts" setup>
const store = findingStore()
const loading = computed(() => store.loading);
</script>

<template>
  <div class="min-w-72  p-6 pb-6 h-full ">
    <div class=" h-full flex flex-col gap-2">

      <div class="flex justify-end">
        <p class="text-[0.6rem]" v-if="loading">
          Loading
        </p>
        <p class="text-[0.6rem]" v-else-if="store.createdAt">{{ formatDate(store.createdAt, "DD MMM YYYY") }}</p>
      </div>
      <div class="flex items-center gap-2 pb-4">
        <UAvatar :alt="store.name?.toUpperCase()" class="w-12 h-12" />
        <div class="flex justify-center flex-col" v-if="loading">
          <div class="text-sm font-semibold">Loading</div>
          <div class="text-xs">Created By <span class="font-bold">Loading</span></div>
        </div>
        <div class="flex justify-center flex-col" v-else-if="store.name && store.createdBy">
          <div class="text-sm font-semibold" v-if="store.isEditor === false">{{ store.name }}</div>
          <UInput class="text-sm font-semibold" v-else-if="store.isEditor === true" v-model="store.name" />
          <div class="text-xs">Created By <span class="font-bold">{{ store.createdBy.name }}</span></div>
        </div>
      </div>
      <hr />
      <div class="grow overflow-y-auto ">
        <div class=" flex flex-col   h-full">

          <div class="flex flex-col gap-1 py-2">
            <div class="font-['Roboto'] font-bold text-base">Finding Properties</div>
            <div>
              <FindingItem :loading="loading" label="Category">
                {{ store.category ?? '-' }}

              </FindingItem>
              <FindingItem :loading="loading" label="Location">
                {{ store.location ?? '-' }}

              </FindingItem>
              <FindingItem :loading="loading" label="Method">
                {{ store.method ?? '-' }}

              </FindingItem>
              <FindingItem :loading="loading" label="Environment">
                {{ store.environment ?? '-' }}

              </FindingItem>
              <FindingItem :loading="loading" label="Application">
                {{ store.application ?? '-' }}

              </FindingItem>
              <FindingItem :loading="loading" label="Risk (Impact)">
                {{ store.impact ?? '-' }}

              </FindingItem>
              <FindingItem :loading="loading" label="Risk (Likelihood)">
                {{ store.likelihood ?? '-' }}

              </FindingItem>

            </div>
          </div>
          <hr>
          <div class="flex flex-col gap-1 py-2">
            <div class="font-['Roboto'] font-bold text-base">Retest Properties</div>
            <div>
              <FindingItem :loading="loading" label="Last Updated">
                {{ store.latestUpdate ?? '-' }}

              </FindingItem>
              <FindingItem :loading="loading" label="Tester">
                -

              </FindingItem>
              <FindingItem :loading="loading" label="Status">
                {{ store.status ?? '-' }}

              </FindingItem>
              <FindingItem :loading="loading" label="Releases">
                {{ store.releases ?? '-' }}

              </FindingItem>
            </div>
          </div>
          <hr>
          <div class="flex flex-col gap-1 py-2">
            <div class="font-['Roboto'] font-bold text-base">CVSS</div>
            <div class="text-sm">
              <div>CVSS:4.0</div>
              <div class="text-xs">CVSS v4.0 Score: <span>7.7 / High</span></div>
            </div>
          </div>
          <div class="flex flex-col gap-1 py-2">
            <div class="font-['Roboto'] font-bold text-base">Testers</div>
            <div class="text-sm">
              <div>CVSS:4.0</div>
              <div class="text-xs">CVSS v4.0 Score: <span>7.7 / High</span></div>
            </div>
          </div>

        </div>
      </div>


    </div>
  </div>
</template>

<style scoped></style>

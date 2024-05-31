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
            <div class="flex flex-col gap-2">
              <FindingItem :loading="loading" label="Category">
                <div v-if="!store.isEditor || (!store.isEditor)">
                  {{ store.category ?? '-' }}
                </div>
                <UInput v-else v-model="store.category" size="2xs" />

              </FindingItem>
              <FindingItem :loading="loading" label="Location">
                <div v-if="!store.isEditor || (!store.isEditor)">
                  {{ store.location ?? '-' }}
                </div>
                <UInput v-else v-model="store.location" size="2xs" />

              </FindingItem>
              <FindingItem :loading="loading" label="Method">
                <div v-if="!store.isEditor || (!store.isEditor)">
                  {{ store.method ?? '-' }}
                </div>
                <UInput v-else v-model="store.method" size="2xs" />

              </FindingItem>
              <FindingItem :loading="loading" label="Environment">
                <div v-if="!store.isEditor || (!store.isEditor)">
                  {{ store.environment ?? '-' }}
                </div>
                <UInput v-else v-model="store.environment" size="2xs" />

              </FindingItem>
              <FindingItem :loading="loading" label="Application">
                <div v-if="!store.isEditor || (!store.isEditor)">
                  {{ store.application ?? '-' }}
                </div>
                <UInput v-else v-model="store.application" size="2xs" />

              </FindingItem>
              <FindingItem :loading="loading" label="Risk (Impact)">
                <div v-if="!store.isEditor || (!store.isEditor)">
                  {{ store.impact ?? '-' }}
                </div>
                <UInput v-else v-model="store.impact" size="2xs" />

              </FindingItem>
              <FindingItem :loading="loading" label="Risk (Likelihood)">
                <div v-if="!store.isEditor || (!store.isEditor)">
                  {{ store.likelihood ?? '-' }}
                </div>
                <UInput v-else v-model="store.likelihood" size="2xs" />

              </FindingItem>

            </div>
          </div>
          <hr>
          <div class="flex flex-col gap-1 py-2">
            <div class="font-['Roboto'] font-bold text-base">Retest Properties</div>
            <div class="flex flex-col gap-2">
              <FindingItem :loading="loading" label="Last Updated">
                <div>
                  {{ store.latestUpdate ?? '-' }}
                </div>


              </FindingItem>
              <FindingItem :loading="loading" label="Tester">
                -

              </FindingItem>
              <FindingItem :loading="loading" label="Status">
                <div>
                  {{ store.status ?? '-' }}
                </div>


              </FindingItem>
              <FindingItem :loading="loading" label="Releases">
                <div>
                  {{ store.releases ?? '-' }}
                </div>


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

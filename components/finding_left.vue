<script lang="ts" setup>
const store = findingStore()
const finding = computed(() => store.finding);
const loading = computed(() => store.loading);
</script>

<template>
  <div class="min-w-72  p-6" v-if="!loading && finding">
    <div class=" h-full flex flex-col gap-2">
      <div class="">
        <div class="flex justify-end">
          <p class="text-[0.6rem]">{{ formatDate(finding.createdAt, "DD MMM YYYY") }}</p>
        </div>

        <div class="flex items-center gap-2 pb-4">
          <UAvatar :alt="finding.name.toUpperCase()" class="w-12 h-12" />
          <div class="flex justify-center flex-col ">
            <div class="text-sm font-semibold">{{ finding.name }}</div>
            <div class="text-xs">Created By <span class="font-bold">{{ finding.createdBy.name }}</span></div>
          </div>
        </div>
        <hr />
        <div class="flex flex-col gap-1 py-4">
          <div class="font-['Roboto'] font-bold text-base">Finding Properties</div>
          <div>
            <FindingItem label="Category">-</FindingItem>
            <FindingItem label="Location">-</FindingItem>
            <FindingItem label="Method">-</FindingItem>
            <FindingItem label="Environment">-</FindingItem>
            <FindingItem label="Application">-</FindingItem>
            <FindingItem label="Risk (Imapct)">-</FindingItem>
            <FindingItem label="Risk (Likelihood)">-</FindingItem>

          </div>
        </div>
        <hr>
        <div class="flex flex-col gap-1 py-4">
          <div class="font-['Roboto'] font-bold text-base">Retest Properties</div>
          <div>
            <FindingItem label="Last Updated">-</FindingItem>
            <FindingItem label="Tester">-</FindingItem>
            <FindingItem label="Status">-</FindingItem>
            <FindingItem label="Releases">-</FindingItem>
          </div>
        </div>
        <hr>
        <div class="flex flex-col gap-1 py-4">
          <div class="font-['Roboto'] font-bold text-base">CVSS</div>
          <div class="text-sm">
            <div>CVSS:4.0</div>
            <div class="text-xs">CVSS v4.0 Score: <span>7.7 / High</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

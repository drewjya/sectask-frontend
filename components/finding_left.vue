<script lang="ts" setup>
import { CVSS40 } from '@pandatix/js-cvss';
const store = findingStore()
const loading = computed(() => store.loading);
const cvss = computed(() => store.cvss);

const score = computed(() => {
  if (!cvss.value) {
    return {
      value: "CVSS:4.0",
      score: "0.0 / None"
    }
  }
  let val = "CVSS:4.0"
  val += "/AV:" + cvss.value.AV
  val += "/AC:" + cvss.value.AC
  val += "/AT:" + cvss.value.AT
  val += "/PR:" + cvss.value.PR
  val += "/UI:" + cvss.value.UI
  val += "/VC:" + cvss.value.VC
  val += "/VI:" + cvss.value.VI
  val += "/VA:" + cvss.value.VA
  val += "/SC:" + cvss.value.SC
  val += "/SI:" + cvss.value.SI
  val += "/SA:" + cvss.value.SA
  if (cvss.value.E !== "X") {
    val += "/E:" + cvss.value.E
  }
  if (cvss.value.CR !== "X") {
    val += "/CR:" + cvss.value.CR
  }
  if (cvss.value.IR !== "X") {
    val += "/IR:" + cvss.value.IR
  }
  if (cvss.value.AR !== "X") {
    val += "/AR:" + cvss.value.AR
  }
  if (cvss.value.MAV !== "X") {
    val += "/MAV:" + cvss.value.MAV
  }
  if (cvss.value.MAC !== "X") {
    val += "/MAC:" + cvss.value.MAC
  }
  if (cvss.value.MAT !== "X") {
    val += "/MAT:" + cvss.value.MAT
  }
  if (cvss.value.MPR !== "X") {
    val += "/MPR:" + cvss.value.MPR
  }
  if (cvss.value.MUI !== "X") {
    val += "/MUI:" + cvss.value.MUI
  }
  if (cvss.value.MVC !== "X") {
    val += "/MVC:" + cvss.value.MVC
  }
  if (cvss.value.MVI !== "X") {
    val += "/MVI:" + cvss.value.MVI
  }
  if (cvss.value.MVA !== "X") {
    val += "/MVA:" + cvss.value.MVA
  }
  if (cvss.value.MSC !== "X") {
    val += "/MSC:" + cvss.value.MSC
  }
  if (cvss.value.MSI !== "X") {
    val += "/MSI:" + cvss.value.MSI
  }
  if (cvss.value.MSA !== "X") {
    val += "/MSA:" + cvss.value.MSA
  }
  if (cvss.value.S !== "X") {
    val += "/S:" + cvss.value.S
  }
  if (cvss.value.AU !== "X") {
    val += "/AU:" + cvss.value.AU
  }
  if (cvss.value.R !== "X") {
    val += "/R:" + cvss.value.R
  }
  if (cvss.value.V !== "X") {
    val += "/V:" + cvss.value.V
  }
  if (cvss.value.RE !== "X") {
    val += "/RE:" + cvss.value.RE
  }
  if (cvss.value.U !== "X") {
    val += "/U:" + cvss.value.U
  }
  let vec = new CVSS40(val);
  console.log(vec.Score());
  const rangeVal = () => {
    if (vec.Score() === 0.0) {
      return "None"
    } else if (vec.Score() <= 3.9) {
      return "Low"
    } else if (vec.Score() <= 6.9) {
      return "Medium"
    } else if (vec.Score() <= 8.9) {
      return "High"
    } else {
      return "Critical"
    }
  }
  return {
    value: val,
    score: `${vec.Score()} / ${rangeVal()}`
  };
})




</script>

<template>
  <div class="w-80 min-w-80 max-w-80 p-6 pb-6 h-full ">
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
          <div class="text-sm font-semibold " v-if="store.isEditor === false">
            <div class="text-ellipsis  line-clamp-1 w-48">{{ store.name }}</div>
          </div>
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
              <div class="w-64 overflow-x-auto">
                <div>{{ score.value }}</div>
              </div>
              <div class="text-xs">CVSS v4.0 Score: <span>{{ score.score }}</span></div>
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

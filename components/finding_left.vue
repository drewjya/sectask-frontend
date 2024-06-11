<script lang="ts" setup>
import { CVSS40 } from "@pandatix/js-cvss";
const store = findingStore();
const loading = computed(() => store.loading);
const cvss = computed(() => store.cvss);

const score = computed(() => {
  if (!cvss.value) {
    return {
      value: "CVSS:4.0",
      score: "0.0 / None",
    };
  }
  let val = "CVSS:4.0";
  val += "/AV:" + cvss.value.AV;
  val += "/AC:" + cvss.value.AC;
  val += "/AT:" + cvss.value.AT;
  val += "/PR:" + cvss.value.PR;
  val += "/UI:" + cvss.value.UI;
  val += "/VC:" + cvss.value.VC;
  val += "/VI:" + cvss.value.VI;
  val += "/VA:" + cvss.value.VA;
  val += "/SC:" + cvss.value.SC;
  val += "/SI:" + cvss.value.SI;
  val += "/SA:" + cvss.value.SA;
  if (cvss.value.E !== "X") {
    val += "/E:" + cvss.value.E;
  }
  if (cvss.value.CR !== "X") {
    val += "/CR:" + cvss.value.CR;
  }
  if (cvss.value.IR !== "X") {
    val += "/IR:" + cvss.value.IR;
  }
  if (cvss.value.AR !== "X") {
    val += "/AR:" + cvss.value.AR;
  }
  if (cvss.value.MAV !== "X") {
    val += "/MAV:" + cvss.value.MAV;
  }
  if (cvss.value.MAC !== "X") {
    val += "/MAC:" + cvss.value.MAC;
  }
  if (cvss.value.MAT !== "X") {
    val += "/MAT:" + cvss.value.MAT;
  }
  if (cvss.value.MPR !== "X") {
    val += "/MPR:" + cvss.value.MPR;
  }
  if (cvss.value.MUI !== "X") {
    val += "/MUI:" + cvss.value.MUI;
  }
  if (cvss.value.MVC !== "X") {
    val += "/MVC:" + cvss.value.MVC;
  }
  if (cvss.value.MVI !== "X") {
    val += "/MVI:" + cvss.value.MVI;
  }
  if (cvss.value.MVA !== "X") {
    val += "/MVA:" + cvss.value.MVA;
  }
  if (cvss.value.MSC !== "X") {
    val += "/MSC:" + cvss.value.MSC;
  }
  if (cvss.value.MSI !== "X") {
    val += "/MSI:" + cvss.value.MSI;
  }
  if (cvss.value.MSA !== "X") {
    val += "/MSA:" + cvss.value.MSA;
  }
  if (cvss.value.S !== "X") {
    val += "/S:" + cvss.value.S;
  }
  if (cvss.value.AU !== "X") {
    val += "/AU:" + cvss.value.AU;
  }
  if (cvss.value.R !== "X") {
    val += "/R:" + cvss.value.R;
  }
  if (cvss.value.V !== "X") {
    val += "/V:" + cvss.value.V;
  }
  if (cvss.value.RE !== "X") {
    val += "/RE:" + cvss.value.RE;
  }
  if (cvss.value.U !== "X") {
    val += "/U:" + cvss.value.U;
  }
  let vec = new CVSS40(val);
  console.log(vec.Score());
  const rangeVal = () => {
    if (vec.Score() === 0.0) {
      return "None";
    } else if (vec.Score() <= 3.9) {
      return "Low";
    } else if (vec.Score() <= 6.9) {
      return "Medium";
    } else if (vec.Score() <= 8.9) {
      return "High";
    } else {
      return "Critical";
    }
  };
  return {
    value: val,
    score: `${vec.Score()} / ${rangeVal()}`,
  };
});

let typingTimeout: ReturnType<typeof setTimeout> | null = null;
const onInput = () => {
  store.onEdit = true;
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    store.onEdit = false;
  }, 500);
};

const onBlur = () => {
  store.onEdit = false;
  if (typingTimeout) clearTimeout(typingTimeout);
};

const onFocus = () => {
  store.onEdit = true;
};
</script>

<template>
  <div class="w-80 min-w-80 max-w-80 p-6 py-3 h-full">
    <div class="h-full flex flex-col gap-1">
      <div class="flex justify-end">
        <p class="text-[0.6rem]" v-if="loading">Loading</p>
        <p class="text-[0.6rem]" v-else-if="store.createdAt">
          {{ formatDate(store.createdAt, "DD MMM YYYY") }}
        </p>
      </div>
      <div class="flex items-center gap-2 pb-4">
        <div class="flex flex-col justify-center items-center gap-2">
          <UBadge
            class="w-12 h-12 flex justify-center object-center text-2xl"
            :label="store.score"
            color="gray"
          />
          <p class="text-xs font-semibold">{{ store.findingStatus }}</p>
        </div>
        <div class="flex justify-center flex-col" v-if="loading">
          <div class="text-sm font-semibold">Loading</div>
          <div class="text-xs">
            <span class="font-bold">Loading</span>
          </div>
        </div>
        <div
          class="flex justify-center flex-col gap-1"
          v-else-if="store.name && store.createdBy"
        >
          <div class="text-sm font-semibold" v-if="store.isEditor === false">
            <div class="text-ellipsis line-clamp-1 w-48">{{ store.name }}</div>
          </div>
          <UInput
            class="text-sm font-semibold"
            v-else-if="store.isEditor === true"
            v-model="store.name"
            @input="onInput"
            @blur="onBlur"
            @focus="onFocus"
          />
          <div class="text-xs flex items-center gap-2">
            <UAvatar
              :src="formatImage(store.createdBy.profilePicture)"
              :alt="store.createdBy.name.toUpperCase()"
              size="2xs"
            />
            <div>{{ store.createdBy.name }}</div>
          </div>
        </div>
      </div>
      <UDivider />
      <div class="grow overflow-y-auto">
        <div class="flex flex-col h-full">
          <div class="flex flex-col gap-1 py-2 pb-4">
            <div class="font-['Roboto'] font-bold text-base">
              Finding Properties
            </div>
            <div class="flex flex-col gap-2">
              <FindingItem
                :loading="loading"
                label="Category"
                icon="material-symbols:category-rounded"
              >
                <USelectMenu
                  :disabled="!store.isEditor || !store.isEditor"
                  v-model="store.category"
                  :options="store.categoryList"
                  :size="'2xs'"
                  class="w-full"
                  placeholder="Select Category"
                >
                </USelectMenu>
              </FindingItem>
              <FindingItem
                :loading="loading"
                label="Location"
                icon="i-material-symbols-location-searching-rounded"
              >
                <USelectMenu
                  v-model="store.location"
                  :disabled="!store.isEditor || !store.isEditor"
                  :options="store.locationList"
                  :size="'2xs'"
                  class="w-full"
                  placeholder="Select Location"
                >
                </USelectMenu>
              </FindingItem>
              <FindingItem
                :loading="loading"
                label="Method"
                icon="i-material-symbols-search-rounded"
              >
                <USelectMenu
                  :disabled="!store.isEditor || !store.isEditor"
                  v-model="store.method"
                  :options="store.methodList"
                  :size="'2xs'"
                  class="w-full"
                  placeholder="Select Method"
                >
                </USelectMenu>
              </FindingItem>
              <FindingItem
                :loading="loading"
                label="Environment"
                icon="i-material-symbols-nest-eco-leaf-outline-rounded"
              >
                <UInput
                  :disabled="!store.isEditor || !store.isEditor"
                  v-model="store.environment"
                  size="2xs"
                  placeholder="Application Version"
                />
              </FindingItem>
              <FindingItem
                :loading="loading"
                label="Application"
                icon="i-heroicons-bars-3-bottom-left"
              >
                <UInput
                  :disabled="!store.isEditor || !store.isEditor"
                  v-model="store.application"
                  size="2xs"
                  placeholder="Application Name"
                />
              </FindingItem>
              <FindingItem
                :loading="loading"
                label="Impact"
                icon="i-material-symbols-bomb-outline-rounded"
              >
                <USelectMenu
                  :disabled="!store.isEditor || !store.isEditor"
                  v-model="store.impact"
                  :options="store.impactList"
                  :size="'2xs'"
                  class="w-full"
                  option-attribute="label"
                  value-attribute="label"
                  placeholder="Select Impact"
                >
                </USelectMenu>
              </FindingItem>
              <FindingItem
                :loading="loading"
                label="Likelihood"
                icon="i-material-symbols-speed-outline-rounded"
              >
                <USelectMenu
                  :disabled="!store.isEditor || !store.isEditor"
                  v-model="store.likelihood"
                  :options="store.likelihoodList"
                  :size="'2xs'"
                  class="w-full"
                  placeholder="Select Likelihood"
                  option-attribute="label"
                  value-attribute="label"
                >
                </USelectMenu>
              </FindingItem>
            </div>
          </div>
          <UDivider />
          <div class="flex flex-col gap-1 py-2">
            <div class="font-['Roboto'] font-bold text-base">
              Retest Properties
            </div>
            <div class="flex flex-col gap-2" v-if="store.retestProperty">
              <FindingItem :loading="loading" label="Last Updated">
                <div class="text-xs">
                  {{
                    formatDate(
                      store.retestProperty.lastUpdated,
                      "DD MMM YYYY, HH:mm"
                    )
                  }}
                </div>
              </FindingItem>
              <FindingItem :loading="loading" label="Tester">
                <div class="flex items-center gap-1">
                  <UAvatar
                    size="2xs"
                    :src="
                      formatImage(store.retestProperty.tester?.profilePicture)
                    "
                    :alt="store.retestProperty.tester.name.toUpperCase()"
                  />
                  <div class="font-bold text-xs">
                    {{ store.retestProperty.tester.name }}
                  </div>
                </div>
              </FindingItem>
              <FindingItem :loading="loading" label="Version">
                <div class="text-xs">
                  {{ store.retestProperty.version }}
                </div>
              </FindingItem>
              <FindingItem :loading="loading" label="Status">
                <div class="text-xs">
                  {{ store.retestProperty.status }}
                </div>
              </FindingItem>
            </div>
            <div class="flex flex-col gap-2" v-else>
              <FindingItem :loading="loading" label="Last Updated">
                -
              </FindingItem>
            </div>
          </div>
          <UDivider />
          <div class="flex flex-col gap-1 py-2">
            <div class="font-['Roboto'] font-bold text-base">CVSS</div>
            <div class="text-sm">
              <div class="w-64 overflow-x-auto flex h-10 items-center">
                <div v-for="i in score.value">{{ i }}</div>
              </div>

              <div class="text-xs">
                CVSS v4.0 Score: <span>{{ score.score }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-1 py-2">
            <div class="font-['Roboto'] font-bold text-base">Testers</div>

            <div
              class="max-h-60 overflow-y-auto bg-gray-200 dark:bg-gray-900 py-4 rounded-md border dark:border-slate-700"
            >
              <div
                class="grid grid-cols-2 place-items-center place-content-center gap-2"
              >
                <div v-for="i in 20" class="flex flex-col items-center text-xs">
                  <UBadge class="w-12 h-12 flex items-center justify-center">
                    <div class="text-xl">A</div>
                  </UBadge>
                  <div>A</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

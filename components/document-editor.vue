<script lang="ts" setup>
import { DocType } from "~/types/data/finding/finding";
import VersionsSlider from "./versions-slider.vue";

const store = findingStore();
const loading = computed(() => store.loading);
const isEditable = computed(() => store.isEditor);

const slider = useSlideover();

const api = useEPrivateApi();

const openSldie = (type: "DESCRIPTION" | "THREAT") => {
  slider.open(VersionsSlider, {
    findingId: store.id,
    onSelect: (value) => {
      if (type === "DESCRIPTION") {
        description.value = value.content;
      } else {
        threat.value = value.content;
      }
      save(type, value.id);
      slider.close();
    },
    type: type === "DESCRIPTION" ? DocType.DESCRIPTION : DocType.THREAT,
  });
};

const description = ref<string>();
const threat = ref<string>();

const save = (type: "DESCRIPTION" | "THREAT", id?: number) => {
  api.post(`/finding/versions/${store.id}?type=${type}`, {
    param: {
      body: {
        content: type === "DESCRIPTION" ? description.value : threat.value,
        basedOnId: id,
      },
    },
  });
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between pr-2">
        <div class="text-lg font-bold">Description</div>
        <UButton
          label="Save"
          color="blue"
          size="xs"
          variant="outline"
          @click="save('DESCRIPTION')"
          v-if="isEditable"
        />
      </div>

      <div class="bg-gray-100 w-full h-64 rounded-lg" v-if="loading"></div>
      <Editor
        v-model="description"
        :editor-id="store.descriptionId"
        v-if="store.descriptionId"
        @open="openSldie('DESCRIPTION')"
        :editable="isEditable"
      />
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between pr-2">
        <div class="text-lg font-bold">Threat & Risk</div>
        <UButton
          label="Save"
          color="blue"
          size="xs"
          variant="outline"
          @click="save('THREAT')"
          v-if="isEditable"
        />
      </div>

      <div class="bg-red-100 w-full h-64 rounded-lg" v-if="loading"></div>
      <Editor
        v-model="threat"
        :editor-id="store.threatAndRiskId"
        v-else-if="store.threatAndRiskId"
        :editable="isEditable"
        @open="openSldie('THREAT')"
      />
    </div>
  </div>
</template>

<style scoped></style>

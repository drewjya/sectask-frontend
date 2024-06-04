<script lang="ts" setup>
const store = findingStore();
const loading = computed(() => store.loading);
const isEditable = computed(() => store.isEditor);

const api = useEPrivateApi();

const notif = useNotification();
const save = (type: "DESCRIPTION" | "THREAT", value: string | undefined) => {
  if (!value) {
    notif.warn({ message: "Please insert content" });
    return;
  }
  api.post(`/finding/versions/${store.id}?type=${type}`, {
    param: {
      body: {
        content: value,
      },
    },
  });
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <VEditor
      :editor-id="store.descriptionId"
      :is-editable="isEditable"
      v-if="store.descriptionId"
      :type="'DESCRIPTION'"
      v-slot="{ text }"
    >
      <div class="flex items-center justify-between pr-2">
        <div class="text-lg font-bold">Description</div>
        <UButton
          label="Save"
          color="blue"
          size="xs"
          variant="outline"
          @click="save('DESCRIPTION', text)"
          v-if="isEditable"
        />
      </div>
    </VEditor>

    <VEditor
      :editor-id="store.threatAndRiskId"
      :is-editable="isEditable"
      v-if="store.threatAndRiskId"
      :type="'THREAT'"
      v-slot="{ text }"
    >
      <div class="flex items-center justify-between pr-2">
        <div class="text-lg font-bold">Threat and Risk</div>
        <UButton
          label="Save"
          color="blue"
          size="xs"
          variant="outline"
          @click="save('THREAT', text)"
          v-if="isEditable"
        />
      </div>
    </VEditor>
  </div>
</template>

<style scoped></style>

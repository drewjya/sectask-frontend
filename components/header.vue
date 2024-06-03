<script lang="ts" setup>
import ProjectImageModal from "./project-image-modal.vue";

const props = defineProps({
  userCanUpdateHeader: {
    type: Boolean,
    required: true,
  },
  error: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  myRole: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  projectManager: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const name = defineModel("name", {
  required: true,
  type: String,
});

const range = defineModel("range", {
  required: true,
  type: Object as PropType<RangeDatePickerModel>,
});
watch(name, (value) => {
  console.log(value);
});

const status = computed(() =>
  getStatus({
    startDate: range.value.start ?? new Date(),
    endDate: range.value.end ?? new Date(),
  })
);
const isFocused = ref(false);

const userCanEditActivePeriode = computed(() => props.userCanUpdateHeader);

const app = useApp();
const modal = useModal();
const editImage = () => {
  modal.open(ProjectImageModal, {
    projectId: props.id,
    name: name.value?.toUpperCase() ?? "-",
    src: props.image,
    onSuccess: () => {
      modal.close();
    },
  });
};
</script>

<template>
  <div class="flex flex-col gap-2 px-8 py-2" v-if="!loading && !error">
    <div class="flex gap-3 items-center">
      <button
        v-if="type === 'project' && userCanUpdateHeader"
        @click="editImage()"
      >
        <UAvatar :alt="name?.toUpperCase()" :src="image" size="lg" />
      </button>

      <UAvatar :alt="name?.toUpperCase()" :src="image" size="lg" v-else />

      <UInput
        v-model="name"
        :disabled="!userCanEditActivePeriode"
        :rows="1"
        placeholder="Untitled"
        autoresize
        :variant="isFocused ? 'outline' : 'none'"
        class="mb-1 w-full font-extrabold transition"
        :class="{
          'hover:bg-gray-200 dark:hover:bg-gray-600': userCanUpdateHeader,
        }"
        size="xl"
        :ui="{
          size: { xl: 'text-3xl tracking-wide' },
          padding: { xl: 'px-2 py-1' },
          base: 'disabled:cursor-not-allowed disabled:opacity-100 ',
        }"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
    <UDivider :ui="{ border: { base: 'dark:border-gray-700' } }" />
    <div
      class="py-2 bg-white dark:bg-gray-900 rounded-md px-9 flex flex-col gap-2"
    >
      <HeaderItem label="Project Status">
        <div
          :style="{
            color: status.color,
            backgroundColor: status.color + '10',
            borderColor: status.color,
            borderWidth: '1.3px',
            borderRadius: '8px',
          }"
          class="px-2 text-[0.8rem] w-max"
        >
          {{ status.value }}
        </div>
      </HeaderItem>
      <HeaderItem label="Project Manager">
        <div class="flex items-center gap-2">
          <UAvatar :alt="projectManager.toUpperCase()" size="xs" />
          <div class="text-xs capitalize">{{ projectManager }}</div>
        </div>
      </HeaderItem>
      <HeaderItem label="Project Active Period">
        <RangeDatePicker
          v-model="range"
          :disabled="!userCanEditActivePeriode"
          variant="solid"
          color="white"
        />
      </HeaderItem>
      <HeaderItem label="Project My Role">
        <div class="capitalize">
          {{ myRole }}
        </div>
      </HeaderItem>
    </div>
  </div>
</template>

<style scoped></style>

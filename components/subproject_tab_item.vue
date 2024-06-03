<script lang="ts" setup>
const props = defineProps<{
  name: string;
  endDate: Date;
  startDate: Date;
  id: number;
  deletable: boolean;
}>();

const status = computed(() =>
  getStatus({
    startDate: props?.startDate ?? new Date(),
    endDate: props?.endDate ?? new Date(),
  })
);

const api = useEPrivateApi();
const deleteSubproject = () => {
  api.remove(`/subproject/${props.id}`, {
    message: "Subproject deleted successfully",
  });
};

const range = computed(() => {
  return {
    start: props.startDate,
    end: props.endDate,
  };
});
</script>

<template>
  <div
    class="grid bg-white dark:bg-gray-900 rounded-md border dark:border-gray-700 py-4 px-2 font-['DM Sans'] gap-2"
    :class="deletable ? 'grid grid-cols-8' : 'grid grid-cols-7'"
  >
    <NuxtLink
      :to="`/subproject/${id}`"
      class="col-span-2 flex items-center gap-2"
    >
      <UAvatar :alt="props?.name.toUpperCase()" />
      <div class="text-[#64748B] dark:text-white text-sm">
        {{ props?.name }}
      </div>
    </NuxtLink>
    <NuxtLink :to="`/subproject/${id}`" class="col-span-2 flex items-center">
      <div
        :style="{
          color: status.color,
          backgroundColor: status.color + '10',
          borderColor: status.color,
          borderWidth: '1.3px',
          borderRadius: '8px',
        }"
        class="px-2 text-[0.8rem]"
      >
        {{ status.value }}
      </div>
    </NuxtLink>
    <NuxtLink
      class="col-span-3 flex items-center text-xs"
      :to="`/subproject/${id}`"
    >
      <RangeDatePicker
        v-model="range"
        color="white"
        variant="solid"
        :disabled="true"
      />
    </NuxtLink>
    <div class="col-span-1 flex items-center" v-if="deletable">
      <UButton
        icon="i-heroicons-trash"
        variant="outline"
        color="red"
        @click="deleteSubproject"
      />
    </div>
  </div>
</template>

<style scoped></style>

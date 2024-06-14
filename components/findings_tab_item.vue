<script lang="ts" setup>
import type { FindingSubproject } from "~/types/data/subproject/subproject";

const props = defineProps<{
  finding: FindingSubproject;
  deletable: boolean;
  approvedDelete: boolean;
}>();

const runtime = useRuntimeConfig();
const api = useEPrivateApi();
const deleteFinding = async () => {
  api.remove(`/finding/${props.finding.id}`, {
    message: "Finding deleted successfully",
  });
};

const canApproved = computed(() => {
  return props.finding.deletedAt && props.approvedDelete;
});
const canDelete = computed(() => {
  return !props.finding.deletedAt && props.deletable;
});
</script>

<template>
  <div
    class="grid bg-white dark:bg-gray-900 rounded-md border dark:border-gray-700 py-4 px-2 font-['DM Sans'] gap-2"
    :class="deletable || approvedDelete ? 'grid-cols-9' : 'grid-cols-8'"
  >
    <NuxtLink
      :to="`/finding/${props.finding.id}`"
      class="col-span-2 flex items-center gap-2"
    >
      <UAvatar :alt="props.finding.name.toUpperCase()" />
      <div
        class="text-[#64748B] text-sm w-52 text-ellipsis line-clamp-1 dark:text-white"
      >
        {{ props.finding.name }}
      </div>
    </NuxtLink>
    <NuxtLink
      :to="`/finding/${finding.id}`"
      class="col-span-2 flex items-center gap-2"
    >
      <UAvatar
        :alt="props.finding.createdBy.name.toUpperCase()"
        :src="
          props.finding.createdBy.profilePicture
            ? `${runtime.public.FILE_URL}${props.finding.createdBy.profilePicture.name}`
            : undefined
        "
      />
      <div class="text-[#64748B] text-sm capitalize dark:text-white">
        {{ props.finding.createdBy.name }}
      </div>
    </NuxtLink>
    <NuxtLink
      :to="`/finding/${props.finding.id}`"
      class="col-span-2 flex items-center text-xs"
    >
      <div class="text-sm font-bold">
        {{ props.finding.risk }} ({{ props.finding.riskValue }})
      </div>
    </NuxtLink>
    <NuxtLink
      :to="`/finding/${props.finding.id}`"
      class="col-span-2 flex items-center text-xs"
    >
      <div class="text-sm font-bold">
        {{ props.finding.status }}
      </div>
    </NuxtLink>
    <div class="col-span-1 flex items-center" v-if="canDelete || canApproved">
      <UButton
        icon="i-heroicons-trash"
        variant="outline"
        color="red"
        @click="deleteFinding"
      />
    </div>
  </div>
</template>

<style scoped></style>

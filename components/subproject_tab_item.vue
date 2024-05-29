<script lang="ts" setup>
const props = defineProps<{
  name: string;
  endDate: Date;
  startDate: Date;
  id: number;
  deletable: boolean;
}
>()

const status = computed(() => getStatus({
  startDate: props?.startDate ?? new Date(),
  endDate: props?.endDate ?? new Date()
}))

const activePeriod = computed(() => `${formatDate(props!.startDate, 'DD MMM, YYYY')} → ${formatDate(props!.endDate, 'DD MMM, YYYY')}`)

</script>

<template>
  <NuxtLink class="grid grid-cols-8 bg-white rounded-md border py-4 px-2 font-['DM Sans'] gap-2"
    :to="`/subproject/${id}`">
    <div class="col-span-2 flex items-center gap-2">
      <UAvatar :alt="props?.name.toUpperCase()" />
      <div class="text-[#64748B] text-sm">{{ props?.name }}</div>
    </div>
    <div class="col-span-2 flex items-center">
      <div :style="{
        color: status.color,
        backgroundColor: status.color + '10',
        borderColor: status.color,
        borderWidth: '1.3px',
        borderRadius: '8px'
      }" class="px-2 text-[0.8rem]">{{ status.value }}</div>
    </div>
    <div class="col-span-3 flex items-center text-xs">
      <ULink class=" border p-2 rounded">
        {{ activePeriod }}</ULink>

    </div>
    <div class="col-span-1 flex items-center">
      <UButton icon="i-heroicons-trash" variant="outline" color="red" />
    </div>
  </NuxtLink>
</template>

<style scoped></style>

<script lang="ts" setup>
import type { OwnerFinding } from '~/types/data/subproject/subproject';

const props = defineProps<{
  createdBy: OwnerFinding;
  id: number;
  name: string;
  risk: string;
  status: string;
  deletable: boolean;
}>();

const runtime = useRuntimeConfig()

</script>

<template>
  <NuxtLink class=" bg-white rounded-md border py-4 px-2 font-['DM Sans'] gap-2" :to="`/finding/${id}`"
    :class="deletable ? 'grid-cols-9' : 'grid-cols-8'">
    <div class="col-span-2 flex items-center gap-2">
      <UAvatar :alt="props?.name.toUpperCase()" />
      <div class="text-[#64748B] text-sm w-52 text-ellipsis line-clamp-1">{{ props?.name }}</div>
    </div>
    <div class="col-span-2 flex items-center gap-2">
      <UAvatar :alt="createdBy.name.toUpperCase()"
        :src="createdBy.profilePicture ? `${runtime.public.FILE_URL}${createdBy.profilePicture.name}` : undefined" />
      <div class="text-[#64748B] text-sm capitalize">{{ createdBy.name }}</div>
    </div>
    <div class="col-span-2 flex items-center text-xs">

      {{ risk }}

    </div>
    <div class="col-span-2 flex items-center text-xs">

      {{ status }}

    </div>
    <div class="col-span-1 flex items-center" v-if="deletable">
      <UButton icon="i-heroicons-trash" variant="outline" color="red" />
    </div>
  </NuxtLink>
</template>

<style scoped></style>

<script lang="ts" setup>
import type { RoomChat } from '~/types/data/finding/finding';


const props = defineProps<
  { discussion: RoomChat }>()
</script>

<template>
  <NuxtLink :to="`/finding/${discussion.findingId}/discussion/${discussion.id}`">
    <div class="font-['Lato'] p-2 bg-slate-200 rounded-sm w-full">

      <div class="text-xl font-bold">{{ discussion.title }}</div>
      <div class="text-xs">
        <span>#{{ `${discussion.id}${discussion.findingId}` }}</span> opened at
        <span>{{ formatDate(discussion.createdAt, 'DD MMM,YYYY HH: mm') }}</span>
      </div>
      <div class="text-xs flex items-center gap-1">
        <div>by</div>
        <UAvatar size="xs" :src="formatImage(discussion.createdBy.profilePicture)"
          :alt="discussion.createdBy.name.toUpperCase()" />
        <div class="font-bold">{{ discussion.createdBy.name }}</div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped></style>

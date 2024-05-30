<script lang="ts" setup>

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  myRole: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  projectManager: {
    type: String,
    required: true
  }
})


const status = computed(() => getStatus({
  startDate: props?.startDate ?? new Date(),
  endDate: props?.endDate ?? new Date()
}))


const activePeriod = computed(() => `${formatDate(props!.startDate, 'DD MMM, YYYY')} → ${formatDate(props!.endDate, 'DD MMM, YYYY')}`)

</script>

<template>
  <div class="flex flex-col gap-2 px-8 py-2">
    <div class="flex gap-3 items-center">
      <UAvatar :alt="name.toUpperCase()" :src="image" size="lg" />
      <div class="capitalize text-lg font-bold font-['Lato']">{{ name }}</div>
    </div>
    <hr>
    <div class="py-2 bg-white rounded-md px-9 flex flex-col gap-2">
      <HeaderItem label="Project Status">
        <div :style="{
          color: status.color,
          backgroundColor: status.color + '10',
          borderColor: status.color,
          borderWidth: '1.3px',
          borderRadius: '8px'
        }" class="px-2 text-[0.8rem] w-max">{{ status.value }}</div>
      </HeaderItem>
      <HeaderItem label="Project Manager">
        <div class="flex items-center gap-2">
          <UAvatar :alt="projectManager.toUpperCase()" size="xs" />
          <div class="text-xs capitalize">{{ projectManager }}</div>
        </div>
      </HeaderItem>
      <HeaderItem label="Project Active Period">
        <div class="border p-1 rounded w-max">{{ activePeriod }}</div>
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

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

const status = ref("-")
onMounted(() => {
  const now = new Date()
  if (now < props.startDate) {
    status.value = "Upcoming"
  } else if (now > props.endDate) {
    status.value = "Completed"
  } else {
    status.value = "Ongoing"
  }
})

</script>

<template>
  <div class="flex flex-col gap-2 px-8 py-2">
    <div class="flex gap-3 items-center">
      <UAvatar :alt="name.toUpperCase()" :src="image" size="lg" />
      <div class="capitalize text-lg font-bold font-['Lato']">{{ name }}</div>
    </div>
    <hr>
    <div class="py-2 bg-white rounded-md px-9 flex flex-col gap-2">
      <HeaderItem label="Project Status">{{ status }}</HeaderItem>
      <HeaderItem label="Project Manager">
        <div class="flex items-center gap-2">
          <UAvatar :alt="projectManager.toUpperCase()" size="xs" />
          <div class="text-xs">{{ projectManager }}</div>
        </div>
      </HeaderItem>
      <HeaderItem label="Project Active Period">saasj</HeaderItem>
      <HeaderItem label="Project My Role">
        <div class="capitalize">
          {{ myRole }}
        </div>
      </HeaderItem>
    </div>
  </div>
</template>

<style scoped></style>

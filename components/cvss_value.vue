<script lang="ts" setup>
const props = defineProps<{
  label: string;
  items: {
    label: string;
    value: string;
  }[],
  selected?: string
  onSelect?: (item: {
    label: string;
    value: string
  }) => void
}>()


const store = findingStore()




</script>

<template>
  <UFormGroup>
    <template #label>
      <div class="text-sm font-bold">{{ label }}</div>
    </template>
    <div class="flex items-center gap-5">
      <UButton v-for="i in items" :label="i.label"
        :variant="i.value === '' ? 'ghost' : (selected === i.value) ? 'solid' : 'outline'"
        :color="selected === i.value ? 'green' : 'white'" size="2xs" :disabled="!store.isEditor"
        @click="i.value === '' || props.onSelect === undefined ? null : props.onSelect(i)"
        class="max-w-40 justify-center min-w-28" />
    </div>


  </UFormGroup>
</template>

<style scoped></style>

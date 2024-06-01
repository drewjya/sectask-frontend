<script lang="ts" setup>
const props = defineProps<{
  title: string
  type: 'supplier' | 'consumer'
}>()
</script>

<template>
  <div class="text-base font-bold py-0.5 bg-gray-800 text-white text-center relative">
    <div>{{ title }} <span class="text-[0.6rem]  absolute  -top-1">
        <UTooltip :text="`This category is usually filled by the ${type}`" :popper="{ placement: 'right' }">
          <div
            class="flex justify-center items-center bg-gray-100 text-black h-3 w-3 hover:bg-gray-700 hover:text-white rounded-lg ">
            <div>?</div>
          </div>
        </UTooltip>
      </span></div>

  </div>
</template>

<style scoped></style>

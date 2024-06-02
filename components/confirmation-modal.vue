<script lang="ts" setup>
const emits = defineEmits(['yes', 'no'])

const props = defineProps<{
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
}>()

</script>

<template>
  <UModal prevent-close>
    <UCard class="w-full" :ui="{
      header: { padding: 'px-8 py-4 sm:px-8 sm:py-4' },
      body: { padding: 'px-8 py-4 sm:px-8 sm:py-4' },
    }">
      <template #header>
        <div class="flex w-full items-center gap-2">
          <span class="text-2xl font-bold">
            {{ props.title }}
          </span>
        </div>
      </template>

      <template #default>
        <div class="mb-8">
          <p class="w-full text-center text-lg font-semibold">
           {{ props.message }}
          </p>
        </div>
        <div class="flex items-center justify-center gap-6">
          <div class="grow">
            <UButton :label="props.confirmLabel" type="button" block variant="solid" class="mt-2" @click="emits('yes')" />
          </div>
          <div class="grow">
            <UButton :label="props.cancelLabel" color="primary" variant="soft" block @click="emits('no')" />
          </div>
        </div>





      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>

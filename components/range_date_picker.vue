<script setup lang="ts">
import type { ButtonVariant } from '#ui/types';


const props = defineProps<{
    variant: ButtonVariant;
    color: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
}>();

const dayjs = useDayjs();
const app = useApp();

const range = defineModel<RangeDatePickerModel>({ required: true });
const startDisplay = computed(() => dayjs(range.value.start).format('DD MMM, YYYY'));
const endDisplay = computed(() => dayjs(range.value.end).format('DD MMM, YYYY'));
</script>

<template>
    <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton icon="i-heroicons-calendar-days-20-solid" class="w-full" :variant="props.variant" :color="props.color" :disabled="props.disabled">
            {{ startDisplay }} → {{ endDisplay }}
        </UButton>

        <template #panel="{ close }">
            <div class="flex items-center divide-x divide-gray-200 dark:divide-gray-800">
                <VDatePicker v-model.range="range" mode="date" :is-dark="app.isDark" :min-date="props.minDate" :max-date="props.maxDate" @close="close" />
            </div>
        </template>
    </UPopover>
</template>

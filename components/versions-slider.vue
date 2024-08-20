<script lang="ts" setup>
import type { DocType, VersionType } from "~/types/data/finding/finding";

const emits = defineEmits<{
  close: [];
  select: [value: VersionType];
}>();

const props = defineProps<{
  findingId: number;
  type: DocType;
}>();

const loading = ref(true);

const version = ref<VersionType[]>();

const notif = useNotification();

const api = usePrivateApi();

onMounted(async () => {
  try {
    const data = await api.get<VersionType[]>(
      `/finding/versions/${props.findingId}?type=${props.type}`
    );
    if (data.status < 400 && data.data) {
      data.data.forEach((item) => {
        item.createdAt = new Date(item.createdAt);
        if (item.basedOn) {
          item.basedOn = new Date(item.basedOn);
        }
      });
      version.value = data.data;
    }
  } catch (error) {}
});
const selected = ref<VersionType>();
</script>

<template>
  <USlideover
    :ui="{
      width: 'max-w-[80vw] ',
      background: 'bg-slate-50 dark:bg-gray-950',
    }"
  >
    <div class="flex flex-col h-screen gap-2">
      <div
        class="p-4 flex justify-between items-center gap-2 bg-slate-50 dark:bg-gray-950"
      >
        <div class="font-bold text-2xl">
          Versions <span class="capitalize">{{ type.toLowerCase() }}</span>
        </div>
      </div>
      <UDivider />
      <div class="flex-grow flex bg-slate-50 dark:bg-gray-950">
        <div class="h-full px-3 gap-2 w-56 overflow-x-auto">
          <div v-if="version">
            <div class="flex flex-col gap-2">
              <div
                v-for="i in version"
                @click="selected = i"
                class="dark:bg-gray-800 bg-gray-200 w-full font-['Lato'] flex gap-1 flex-col py-2"
              >
                <div class="flex gap-1 items-center">
                  <UIcon name="material-symbols:arrow-right" class="text-xl" />
                  <div>
                    <div class="text-sm">
                      {{ formatDate(i.createdAt, "MMMM DD, YYYY, HH:mm A") }}
                    </div>
                    <div class="text-xs" v-if="i.basedOn">
                      <span class="italic">Restored from</span>
                      {{ formatDate(i.basedOn, "MMMM DD, YYYY, HH:mm A") }}
                    </div>
                  </div>
                </div>

                <div class="flex gap-2 items-center p-2">
                  <div class="w-3 h-3 rounded-full bg-blue-300"></div>
                  <div class="text-sm capitalize">{{ i.user.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 p-2">
          <div class="w-full px-2 flex flex-col gap-2">
            <div class="flex justify-end">
              <UButton
                label="Restore"
                variant="ghost"
                @click="emits('select', selected)"
                v-if="selected"
              />
            </div>
            <div
              v-if="selected"
              class="flex-1 dark:bg-gray-700 bg-gray-300 p-4 rounded-sm h-[75vh] max-h-[75vh] overflow-y-auto"
            >
              <div v-if="selected" v-html="selected.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </USlideover>
</template>

<style scoped></style>

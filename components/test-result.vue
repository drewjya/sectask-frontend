<script lang="ts" setup>
import { isApiError } from "~/types/api/error";
import type { TestingHistory } from "~/types/data/finding/finding";
import { FINDING_EVENT } from "~/types/enum/event.enum";
import CreateTestSlider from "./create-test-slider.vue";
import TestSlider from "./test-slider.vue";

const store = findingStore();
const api = usePrivateApi();

const histories = ref<TestingHistory[]>();
const loading = ref(false);
const notif = useNotification();
const socket = useSocket();
onMounted(async () => {
  try {
    loading.value = true;
    const data = await api.get<TestingHistory[]>(`/finding/retest/${store.id}`);
    if (data.status < 400) {
      histories.value = data.data;
      histories.value?.forEach((history) => {
        history.createdAt = new Date(history.createdAt);
      });
    }
  } catch (error) {
    if (isApiError(error)) {
      notif.error({
        message: error.message,
      });
    } else {
      notif.error({
        message: "An error occurred",
      });
    }
  } finally {
    loading.value = false;
  }
  if (histories.value) {
    const conn = await socket.getConnection();
    conn.on(FINDING_EVENT.TESTLIST, (data: TestingHistory) => {
      histories.value?.unshift({
        createdAt: new Date(data.createdAt),
        id: data.id,
        status: data.status,
        tester: data.tester,
        version: data.version,
      });
    });
  }
});

onUnmounted(async () => {
  const conn = await socket.getConnection();

  conn.off(FINDING_EVENT.TESTLIST);
});

const slide = useSlideover();

const onOpen = () => {
  slide.open(CreateTestSlider, {
    onClose: () => {
      slide.close();
    },
  });
};

const operTest = (test: TestingHistory) => {
  slide.open(TestSlider, {
    testId: test.id,
    findingId: store.id,
    onClose: () => {
      slide.close();
    },
  });
};
</script>

<template>
  <div class="flex flex-col h-full gap-3">
    <UButton
      label="New"
      class="justify-center"
      :variant="'solid'"
      color="slate"
      size="xs"
      @click="onOpen"
      v-if="store.isEditor"
    />
    <div class="h-[93%]">
      <div class="flex flex-col overflow-y-auto h-full gap-3" v-if="histories">
        <div
          v-for="i in histories"
          class="bg-gray-100 rounded-sm p-3 font-['Roboto']"
          @click="operTest(i)"
        >
          <div class="flex items-center justify-between">
            <div class="text-sm">
              Version <span class="font-bold">{{ i.version }}</span>
            </div>
            <UButton
              :label="i.status"
              variant="outline"
              size="xs"
              color="black"
            />
          </div>

          <div class="flex items-center gap-1">
            <UAvatar
              size="md"
              :src="formatImage(i.tester?.profilePicture)"
              :alt="i.tester?.name.toUpperCase()"
            />
            <div class="font-bold text-sm">{{ i.tester?.name }}</div>
          </div>
          <div class="flex justify-end">
            <div class="text-xs">
              {{ formatDate(i.createdAt, "DD-MM-YYYY, HH:mm") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

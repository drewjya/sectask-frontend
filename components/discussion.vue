<script lang="ts" setup>
import { isApiError } from "~/types/api/error";
import type { RoomChat } from "~/types/data/finding/finding";
import NewDiscussionModal from "./new-discussion-modal.vue";

const modal = useModal();
const store = findingStore();
const api = usePrivateApi();
const loading = ref(false);
const notif = useNotification();

const isEdited = ref(false);
const search = ref<string>();
const searched = ref<RoomChat[]>();
onMounted(async () => {
  if (!store.discussions) {
    loading.value = true;
    try {
      const data = await api.get<RoomChat[]>(
        "/finding/" + store.id + "/discussions"
      );
      if (data.data) {
        store.discussions = data.data;
        store.discussions.forEach((e) => {
          e.createdAt = new Date(e.createdAt);
        });
      }
    } catch (error) {
      if (isApiError(error)) {
        if (error.message === "unauthorized") {
        } else {
          notif.error({
            message: error.message,
          });
        }
      } else {
        notif.error({
          message: "Try Again Later",
        });
      }
    } finally {
      loading.value = false;
    }
  }
});
let typingTimeout: ReturnType<typeof setTimeout> | null = null;
const onSearch = () => {
  isEdited.value = true;
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    isEdited.value = false;
  }, 500);
};
const onBlur = () => {
  isEdited.value = false;
  if (typingTimeout) clearTimeout(typingTimeout);
};

const onFocus = () => {
  isEdited.value = true;
};

watch(
  () => [search.value, isEdited.value],
  async () => {
    console.log(isEdited.value);

    if (isEdited.value) {
      return;
    }
    if (!search.value || search.value === "") {
      return;
    }
    loading.value = true;
    try {
      const data = await api.get<RoomChat[]>(
        "/finding/" + store.id + `/discussions?query=${search.value}`
      );
      if (data.data) {
        searched.value = data.data;
        searched.value.forEach((e) => {
          e.createdAt = new Date(e.createdAt);
        });
      }
    } catch (error) {
      if (isApiError(error)) {
        if (error.message === "unauthorized") {
        } else {
          notif.error({
            message: error.message,
          });
        }
      } else {
        notif.error({
          message: "Try Again Later",
        });
      }
    } finally {
      loading.value = false;
    }
  }
);

const openModal = () => {
  modal.open(NewDiscussionModal, {
    findingId: store.id,
    onClose: () => {
      modal.close();
    },
  });
};
</script>

<template>
  <div class="flex flex-col gap-4 p-2">
    <div class="flex gap-2">
      <UInput v-model="search" @input="onSearch" @focus="onFocus" @blur="onBlur" placeholder="Search" class="w-full"
        size="xs" />
      <UButton icon="material-symbols:add" size="xs" color="slate" @click="openModal" />
    </div>
    <div v-if="loading">Loading</div>
    <div v-else-if="search && search !== ''">
      <div v-if="!searched">Loading</div>
      <div v-else-if="searched.length === 0">Discussion Not Found</div>
      <div v-else>
        <DiscussionItem v-for="i in searched" :discussion="i" />
      </div>
    </div>
    <div v-else>
      <div v-if="!store.discussions">Loading</div>
      <div v-else-if="store.discussions.length === 0">Discussion Not Found</div>
      <div v-else>
        <DiscussionItem v-for="i in store.discussions" :discussion="i" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
const emits = defineEmits(["close"]);

const onClose = () => {
  emits("close");
};
const api = usePrivateApi();
const loading = ref(false);
type ProjectSearch<T> = {
  name: string;
  id: number;
  startDate: T;
  endDate: T;
};
const selected = ref<ProjectSearch<Date>>();

const search = async (query: string) => {
  loading.value = true;
  const users = await api.get<ProjectSearch<string>[]>(
    `/project/search?name=${query}`
  );

  loading.value = false;
  // return users.data;
  return (users.data ?? []).map((e) => {
    return {
      ...e,
      startDate: new Date(e.startDate),
      endDate: new Date(e.endDate),
    };
  });
  // const datas = users.data ?? [];
};
const router = useRouter();
watch(selected, (val) => {
  console.log(val);

  if (val) {
    router.push(`/project/${val.id}`);
    onClose();
  }
});

const notif = useNotification();
</script>

<template>
  <UModal @close="() => onClose()">
    <UCard
      class="w-full"
      :ui="{
        header: { padding: 'px-8 py-4 sm:px-8 sm:py-4' },
        body: { padding: 'px-8 py-4 sm:px-8 sm:py-4' },
      }"
    >
      <template #header>
        <div class="flex w-full items-center gap-2">
          <span class="text-2xl font-bold"> Search Project </span>
        </div>
      </template>

      <template #default>
        <section class="flex w-full flex-col gap-4">
          <span class="text-base font-bold">Title</span>
          <section class="flex w-full items-start gap-2">
            <UFormGroup name="email" class="mt-2 w-full">
              <UInputMenu
                icon="i-heroicons-envelope"
                :loading="loading"
                :search="search"
                option-attribute="name"
                trailing
                by="id"
                v-model="selected"
              >
                <template #option="data: { option: ProjectSearch<Date> }">
                  <div class="flex flex-col">
                    <div>{{ data.option.name }}</div>

                    <div>
                      {{ formatDate(data.option.startDate, "DD MMM, YYYY") }} →
                      {{ formatDate(data.option.endDate, "DD MMM, YYYY") }}
                    </div>
                  </div>
                </template>
              </UInputMenu>
            </UFormGroup>
          </section>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>

<script lang="ts" setup>
import dayjs from "dayjs";
import { z } from "zod";
import { isApiError } from "~/types/api/error";

const emits = defineEmits(["close"]);

const onClose = () => {
  emits("close");
};
const api = usePrivateApi();
const loading = ref(false);
type UserSearch = {
  email: string;
  id: number;
  name: string;
};
const selected = ref<UserSearch>();

const search = async (query: string) => {
  loading.value = true;
  const users = await api.get<UserSearch[]>(`/project/member?email=${query}`);
  console.log(users);
  loading.value = false;

  const datas = users.data ?? [];
  return datas.filter(
    (i) => !formD.state.members.find((j) => j.email === i.email)
  );
};

const formD = useForm({
  schema: z.object({
    name: z.string({ required_error: "Name is required" }),
    range: z.object({
      start: z.date({ required_error: "Start date is required" }),
      end: z.date({ required_error: "End date is required" }),
    }),
    members: z.array(
      z.object({
        userId: z.number(),
        email: z.string(),

        role: z.nativeEnum(Role),
      })
    ),
  }),
  initial: {
    members: [],
    range: {
      start: dayjs().startOf("day").toDate(),
      end: dayjs().startOf("day").add(1, "day").toDate(),
    },
  },
  onSubmit: async (form) => {
    try {
      await api.post("/project/new", {
        body: {
          name: form.data.name,
          startDate: form.data.range.start,
          endDate: form.data.range.end,
          members: form.data.members.map((i) => ({
            userId: i.userId,
            role: i.role,
          })),
        },
      });
      notif.ok({ message: "Project created" });
      onClose();
    } catch (error) {
      if (isApiError(error)) {
        notif.error({ message: error.message });
      } else {
        notif.error({ message: "Please try again later", title: "Error" });
      }
    }
  },
});
function updateRoleAt(index: number, role: Role) {
  formD.state.members[index].role = role;
}
function removeInviteAt(index: number) {
  formD.state.members.splice(index, 1);
}
const notif = useNotification();
const addMember = () => {
  if (!selected.value) {
    notif.info({ message: "Please select a user" });
    return;
  }
  formD.state.members.push({
    userId: selected.value.id,
    email: selected.value.email,
    role: Role.VIEWER,
  });
  selected.value = undefined;
};
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
          <span class="text-2xl font-bold"> Create Project </span>
        </div>
      </template>

      <template #default>
        <section class="flex w-full flex-col gap-4">
          <section class="flex w-full flex-col">
            <span class="text-base font-bold">Title</span>
            <UFormGroup name="name" class="mt-2 w-full">
              <UInput placeholder="Untitled" v-model="formD.state.name" />
            </UFormGroup>
          </section>

          <section class="flex w-full flex-col">
            <span class="text-base font-bold">Active Period</span>
            <UFormGroup name="range" class="mt-2 w-full">
              <RangeDatePicker
                v-model="formD.state.range"
                color="white"
                variant="solid"
              />
            </UFormGroup>
          </section>

          <vform class="flex w-full flex-col" :form="formD">
            <span class="text-base font-bold">Members</span>
            <section class="flex w-full items-start gap-2">
              <UFormGroup name="email" class="mt-2 w-full">
                <UInputMenu
                  icon="i-heroicons-envelope"
                  placeholder="name@email.com"
                  :loading="loading"
                  :search="search"
                  option-attribute="email"
                  trailing
                  by="id"
                  v-model="selected"
                />
              </UFormGroup>
              <UButton
                color="white"
                variant="solid"
                type="button"
                label="Add"
                icon="i-heroicons-plus"
                class="mt-2"
                @click="addMember"
              />
            </section>

            <div
              class="mt-3 h-56 max-h-56 w-full flex-col overflow-y-auto rounded-md border border-gray-200"
            >
              <template v-if="formD.state.members.length === 0">
                <div class="flex size-full items-center justify-center">
                  <section
                    class="flex flex-col items-center justify-center opacity-70"
                  >
                    <UIcon name="i-heroicons-no-symbol" class="text-6xl" />
                    <span class="text-base font-semibold">Empty</span>
                    <span class="text-sm"
                      >Add members by email, or skip this step.</span
                    >
                  </section>
                </div>
              </template>
              <template v-else>
                <div
                  v-for="(invite, index) in formD.state.members"
                  :key="invite.email"
                  class="group flex w-full items-center justify-between border-b border-gray-200 px-4 py-1"
                >
                  <span class="text-sm font-medium">{{ invite.email }}</span>

                  <UDropdown
                    :items="[
                      [
                        {
                          label: 'Viewer',
                          icon: 'i-heroicons-user',
                          click: () => updateRoleAt(index, Role.VIEWER),
                        },
                        {
                          label: 'Developer',
                          icon: 'i-heroicons-code-bracket',
                          click: () => updateRoleAt(index, Role.DEVELOPER),
                        },
                        {
                          label: 'Writer',
                          icon: 'i-heroicons-pencil',
                          click: () =>
                            updateRoleAt(index, Role.TECHNICAL_WRITER),
                        },
                        {
                          label: 'Remove',
                          icon: 'i-heroicons-x-circle',
                          click: () => removeInviteAt(index),
                        },
                      ],
                    ]"
                    :popper="{ placement: 'right' }"
                  >
                    <UButton
                      color="white"
                      :label="roleLabel(invite.role)"
                      variant="ghost"
                      trailing-icon="i-heroicons-chevron-down-20-solid"
                      size="xs"
                    />
                  </UDropdown>
                </div>
              </template>
            </div>
          </vform>

          <UButton
            label="Submit"
            type="submit"
            block
            variant="solid"
            class="mt-2"
            @click="formD.submit.value"
          />
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>

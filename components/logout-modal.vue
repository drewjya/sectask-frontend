<script setup lang="ts">

const auth = useAuth();
const notif = useNotification();

async function doLogoutAction() {
  auth.logout();
  notif.ok({ message: 'Logout Success' });
  onClose();
}

const emits = defineEmits(['close']);

const onClose = () => {
  emits('close');
}
</script>

<template>
  <UModal>
    <UCard>
      <div class="mb-8">
        <p class="w-full text-center text-lg font-semibold">
          Are you sure you want to logout?
        </p>
      </div>
      <div class="flex items-center justify-center gap-6">
        <div class="grow">
          <UButton label="Yes" color="red" variant="soft" block @click="doLogoutAction" />
        </div>
        <div class="grow">
          <UButton label="No" color="primary" variant="soft" block @click="onClose()" />
        </div>
      </div>
    </UCard>
  </UModal>
</template>

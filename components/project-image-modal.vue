<script lang="ts" setup>
import { Cropper } from 'vue-advanced-cropper';
const app = useApp();
const api = usePrivateApi();
const auth = useAuth()
const notif = useNotification();
const props = defineProps<{ projectId: number, name: string, src?: string }>()

const isSubmitting = ref(false);
const fileInputRef = ref<HTMLInputElement>();
const cropperRef = ref();
const chosenImageSrc = ref<string>();

const isCroppingPicture = computed(() => chosenImageSrc.value !== undefined);
function cropperBoundry({ cropper }: any) {
  return {
    width: cropper.clientWidth,
    height: cropper.clientHeight,
  };
}

// Actions
function choosePicture() {
  const fileInputEl = fileInputRef.value as HTMLInputElement;
  if (!fileInputEl || !fileInputEl.files)
    return;
  const uploadedImage = fileInputEl.files[0];
  const fileType = uploadedImage.type;
  if (!fileType.startsWith('image/') || fileType.endsWith('svg')) {
    onClose()
    notif.error({
      title: 'Upload Failed',
      message: 'Image file type not supported',
    });
    chosenImageSrc.value = undefined;
    return;
  }
  chosenImageSrc.value = URL.createObjectURL(uploadedImage);
}

const uploadImage = async () => {
  isSubmitting.value = true;
  if (cropperRef.value) {
    const image = cropperRef.value.getResult().canvas as HTMLCanvasElement;
    const blob: Blob = await new Promise(resolve => image.toBlob(result => resolve(result!)));
    const resizedBlob = await imageResize(blob, useRuntimeConfig().public.FILE_MAX_SIZE / 1000);
    const formData = new FormData()
    formData.append('file', new File([resizedBlob], "file.png"))
    try {
      await api.post(
        `/project/${props.projectId}/picture`,
        {
          body: formData,
        },
      );


      auth.refreshToken()
      notif.ok({ message: 'upload_success' });
    }
    catch (err: any) {
      notif.error({ message: 'upload_fail' });
    }
  }
  onClose()
  resetModal();
}

async function onRemove() {
  isSubmitting.value = true;
  try {
    if (!app.userImageUrl) {

      notif.info({ message: 'No Profile Image' });
    } else {
      await api.remove(
        `/project/${props.projectId}/picture`,

      );
      auth.refreshToken()
      notif.ok({ message: 'update_success' });

    }
  }
  catch (err: any) {
    notif.error({ message: 'update_fail' });
  }
  onClose()
  resetModal();
}
function resetModal() {
  isSubmitting.value = false;
  chosenImageSrc.value = undefined;
}

function closeModal() {
  resetModal();
  onClose()
}
function cropperError() {
  onClose()
  notif.error({
    title: 'Upload Failed',
    message: 'Image file type not supported',
  });
  chosenImageSrc.value = undefined;
}




const emit = defineEmits(['success'])

function onClose() {
  emit('success')
}
</script>

<template>
  <UModal :prevent-close="isSubmitting" @close="closeModal">
    <UCard>
      <!-- header -->
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">
            Profile Image
          </h3>
          <UButton variant="ghost" icon="i-heroicons-x-mark-20-solid" :padded="false" :disabled="isSubmitting"
            @click="closeModal" />
        </div>
      </template>

      <!-- body -->
      <template #default>
        <div class="w-full">
          <div v-if="!isCroppingPicture" class="flex w-full flex-col items-center justify-center gap-8">
            <UAvatar :src="src" :alt="name" size="3xl" />
            <input ref="fileInputRef" class="hidden" type="file" accept="image/*" @change="choosePicture">
            <div class="flex w-full flex-col gap-2">
              <UButton label="Change" :loading="isSubmitting" block @click="fileInputRef?.click()" />
              <UButton label="Delete" :loading="isSubmitting" color="red" variant="outline" block @click="onRemove" />
            </div>
          </div>
          <div v-else class="flex w-full flex-col items-center justify-center gap-6">
            <div class="h-96 w-full max-w-full overflow-hidden rounded-md border border-gray-200">
              <Cropper ref="cropperRef" class="size-full" image-restriction="stencil" :src="chosenImageSrc"
                :default-boundaries="cropperBoundry" :resize-image="{
                  adjustStencil: false,
                }" :transition="false" :debounce="false" :stencil-props="{
                  handlers: {},
                  movable: false,
                  resizable: false,
                  scalable: false,
                  aspectRatio: 1,
                }" :canvas="{
                  height: 300,
                  width: 300,
                }" :stencil-size="{
                  width: 200,
                  height: 200,
                }" :onerror="cropperError" />
            </div>

            <div class="flex w-full items-center justify-center gap-10">
              <UButton icon="i-heroicons-magnifying-glass-plus" variant="outline" @click="cropperRef.zoom(1.3)" />
              <UButton icon="i-heroicons-magnifying-glass-minus" variant="outline" @click="cropperRef.zoom(0.7)" />
            </div>

            <UButton label="Save" block :loading="isSubmitting" @click="uploadImage" />
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

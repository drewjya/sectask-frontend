<script lang="ts" setup>
import type { VFile } from '~/types/data/file';

import { useFileDialog } from '@vueuse/core';
import { isApiError } from '~/types/api/error';

const api = usePrivateApi()
const props = defineProps<{
  attachments?: VFile[]
  reports?: VFile[]
  myRole: Role,
  doctype: string,
  docId: number,
  loading: boolean


}>()

const reportFileDialog = useFileDialog({
  directory: false,
  multiple: false,
  reset: true,
})

const attachmentFileDialog = useFileDialog({
  directory: false,
  multiple: false,
  reset: true,
});

const notif = useNotification()
reportFileDialog.onChange(files => upload({
  files,
  type: 'report'
}))
attachmentFileDialog.onChange(files => upload({
  files,
  type: 'attachment'
}))
const upload = async (param: { files?: FileList | null, type: string }) => {
  console.log('uploading attachment', props.docId, props.doctype);
  try {
    const id = props.docId
    const doctype = props.doctype
    const formData = new FormData()
    if (param.files && param.files.length > 0) {
      formData.append('file', param.files[0])
      await api.post(`/${doctype}/${id}/${param.type}/add`, {
        body: formData
      })
      notif.ok({
        title: 'Success',
        message: param.type + ' uploaded'
      })
      return

    }
  } catch (error) {
    if (isApiError(error)) {
      notif.error({
        title: 'Error',
        message: error.message
      })
    } else {
      notif.error({
        title: 'Error',
        message: 'Try again later'
      })
    }

  }

}

</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
    <VFileList title="Reports" :files="props.reports" :canUpload="myRole === Role.TECHNICAL_WRITER" @upload="() => {
      reportFileDialog.open()
    }" type="report" :doctype="doctype" :docId="docId" :loading="loading" />
    <VFileList title="Attachment" :files="props.attachments" :canUpload="myRole === Role.DEVELOPER" @upload="() => {

      attachmentFileDialog.open()
    }" type="attachment" :doctype="doctype" :docId="docId" :loading="loading" />

  </div>
</template>

<style scoped></style>

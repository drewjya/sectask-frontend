<script lang="ts" setup>
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Code from "@tiptap/extension-code";
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import HighLight from '@tiptap/extension-highlight';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import type { Fragment } from '@tiptap/pm/model';
import * as TipTap from '@tiptap/vue-3';
import { isApiError } from '~/types/api/error';
import type { VFile } from '~/types/data/file';



const editor = ref<TipTap.Editor>()
const app = useApp();
const model = defineModel<string>()


const props = defineProps<{
  notEditable?: boolean
}>()

watch(model, (val) => {
  if (!editor.value?.isFocused) {
    editor.value?.commands.setContent(val ?? '<p></p>')
  }
})






onMounted(() => {


  type Levels = 1 | 2 | 3

  const classes: Record<Levels, string> = {
    1: 'text-4xl',
    2: 'text-2xl',
    3: 'text-xl',
  }

  const NewHeading = Heading.configure({
    levels: [1, 2, 3],

  }).extend({
    renderHTML({ node, HTMLAttributes }) {
      const hasLevel = this.options.levels.includes(node.attrs.level)
      const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0]
      return [
        `h${level}`,
        TipTap.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `${classes[level]}`,
        }),
        0,
      ]
    },
  })

  editor.value = new TipTap.Editor({
    editable: !(props.notEditable === true),
    onUpdate: async ({ transaction, editor }) => {
      model.value = editor.getHTML()
      const getImageSrcs = (fragment: Fragment) => {
        let srcs = new Set<string>();
        fragment.forEach((node) => {
          if (node.type.name === 'image') {
            srcs.add(node.attrs.src);
          }
        });
        return srcs;
      };
      let currentSrcs = getImageSrcs(transaction.doc.content);
      let previousSrcs = getImageSrcs(transaction.before.content);

      if (currentSrcs.size === 0 && previousSrcs.size === 0) {
        return;
      }

      let deletedImageSrcs = [...previousSrcs].filter((src) => !currentSrcs.has(src));

      if (deletedImageSrcs.length > 0) {
        //Handle deleting file on cloud here
        console.log(deletedImageSrcs);
        for (const iterator of deletedImageSrcs) {
          const urls = iterator.replaceAll(useRuntimeConfig().public.FILE_URL, '')
          await api.post(`/finding/upload/${urls}`)
        }

      }
    },
    extensions: [
      Document,
      ListItem,
      History,
      Code,
      BulletList,
      Paragraph,
      Strike,
      Text,
      Bold,
      NewHeading,
      Underline,
      OrderedList,
      Italic,
      HardBreak,
      ImageResize,
      HighLight.configure({ HTMLAttributes: { class: 'bg-orange-300 rounded-none px-0.5' } }),
    ]
  })

  editor.value.commands.setContent(model.value ?? '<p></p>')
})

const fileDialog = useFileDialog({
  directory: false,
  multiple: false,
  reset: true,
})

const notif = useNotification()
const api = usePrivateApi()

const upload = async (param: { files?: FileList | null, }) => {
  try {
    const formData = new FormData()
    if (param.files && param.files.length > 0) {
      formData.append('file', param.files[0])
      const data = await api.post<VFile>(`/finding/upload`, {
        body: formData
      })

      if (data.data) {

        const url = await createUrlFile(data.data)
        console.log(url);
        editor.value?.chain().focus().setImage({ src: url }).run()

      }

      notif.ok({
        title: 'Success',
        message: "File" + ' uploaded'
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
      console.log(error);

      notif.error({
        title: 'Error',
        message: 'Try again later'
      })
    }

  }

}

fileDialog.onChange(files => upload({
  files,
}))

onBeforeRouteLeave(() => {
  editor.value?.destroy()
})
</script>

<template>

  <div class="flex flex-col gap-2 p-2">

    <div class="flex gap-1 flex-wrap" v-if="editor && !props.notEditable">
      <UDropdown
        :items="[[{ label: 'Heading 1', click: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() }, { label: 'Heading 2', click: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() }, { label: 'Heading 3', click: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() }]]">
        <UButton
          :label="editor.isActive('heading', { level: 1 }) ? 'Heading 1' : editor.isActive('heading', { level: 2 }) ? 'Heading 2' : 'Heading 3'"
          :size="'xs'" :color="'black'" class="rounded-sm" icon="i-heroicons-chevron-down" />
      </UDropdown>
      <UButton v-for="i in [
        {
          icon: 'i-heroicons-bold',
          tooltip: 'Bold',
          disabled: !editor.can().chain().focus().toggleBold().run(),
          onClicked: () => editor?.chain().focus().toggleBold().run(),
          active: editor.isActive('bold') === true
        },
        {
          icon: 'i-heroicons-italic',
          tooltip: 'Italic',
          disabled: !editor.can().chain().focus().toggleItalic().run(),
          onClicked: () => editor?.chain().focus().toggleItalic().run(),
          active: editor.isActive('italic') === true
        },
        {
          icon: 'i-heroicons-underline',
          tooltip: 'Underline',
          disabled: false,
          onClicked: () => editor?.chain().focus().toggleUnderline().run(),
          active: editor.isActive('underline') === true,
        },
        {
          icon: 'material-symbols:format-list-bulleted-rounded',
          tooltip: 'Bullet List',
          disabled: false,
          onClicked: () => editor?.chain().focus().toggleBulletList().run(),
          active: editor.isActive('bulletList') === true,
        },
        {
          icon: 'material-symbols:format-list-numbered',
          tooltip: 'Numbered List',
          disabled: false,
          onClicked: () => editor?.chain().focus().toggleOrderedList().run(),
          active: editor.isActive('orderedList') === true,
        }, {
          icon: 'material-symbols:format-strikethrough',
          tooltip: 'Strike',
          disabled: editor.can().chain().focus().toggleStrike().run(),
          onClicked: () => editor?.chain().focus().toggleStrike().run(),
          active: editor.isActive('strike') === true,
        }, {
          icon: 'material-symbols:code',
          tooltip: 'Code',
          disabled: false,
          onClicked: () => editor?.chain().focus().toggleCode().run(),
          active: editor.isActive('code') === true,
        }, {
          icon: 'material-symbols:undo',
          tooltip: 'Undo',
          onClicked: () => editor?.chain().focus().undo().run(),
          active: false,
        }, {
          icon: 'material-symbols:redo',
          tooltip: 'Redo',
          onClicked: () => editor?.chain().focus().redo().run(),
          active: false,
        }, {
          icon: 'material-symbols-light:format-ink-highlighter-outline-rounded',
          tooltip: 'Highlight',
          disabled: false,
          onClicked: () => editor?.chain().focus().toggleHighlight().run(),
          active: editor.isActive('highlight') === true,
        }
      ]" :icon="i.icon" dynamic size="2xs" class="rounded-sm" color="black" :variant="i.active ? 'solid' : 'outline'"
        @click="i.onClicked" />
      <UButton icon="material-symbols:add-photo-alternate-outline" color="black" variant="outline" size="2xs"
        class="rounded-sm" @click="fileDialog.open()" />
    </div>
    <div class=" w-full bg-slate-200  rounded-lg">
      <TipTap.EditorContent :editor="editor" />

    </div>
  </div>

</template>

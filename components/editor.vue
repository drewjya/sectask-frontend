<script lang="ts" setup>
import { HocuspocusProvider } from '@hocuspocus/provider';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import HighLight from '@tiptap/extension-highlight';
import ListItem from '@tiptap/extension-list-item';

import Italic from '@tiptap/extension-italic';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import * as TipTap from '@tiptap/vue-3';
const props = defineProps<{
  editorId: string;
  editable: boolean;
}>()


const editor = ref()
const app = useApp();
function getRandomColorHex(): string {
  const randomInt = Math.floor(Math.random() * 16777215);
  const hexString = randomInt.toString(16).padStart(6, '0');
  return `#${hexString}`;
}
onMounted(() => {
  const provider = new HocuspocusProvider({
    url: 'ws://localhost:3100',
    name: props.editorId
  })
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

  const user = app.user?.name || 'anonymous'
  editor.value = new TipTap.Editor({
    editable: props.editable,
    extensions: [
      Document,
      ListItem,
      BulletList,
      Paragraph,
      Text,
      Bold,
      NewHeading,
      Italic,
      HardBreak,
      HighLight.configure({ HTMLAttributes: { class: 'bg-sky-100 rounded-none px-0.5' } }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: user,
          color: getRandomColorHex()
        }

      }),

      Collaboration.configure({
        document: provider.document
      })
    ]
  })
})

onBeforeRouteLeave(() => {
  editor.value.destroy()
})
</script>

<template>
  <div class="bg-slate-200 w-full max-h-64 h-64 rounded-lg">
    <TipTap.EditorContent :editor="editor" />

  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import type { Editor } from "@tiptap/vue-3";

const props = defineProps<{
  editor: Editor;
}>();

const emits = defineEmits(["open", 'dialog']);
</script>

<template>
  <div class="flex gap-1 flex-wrap">
    <UDropdown
      :items="[
        [
          {
            label: 'Heading 1',
            click: () =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run(),
          },
          {
            label: 'Heading 2',
            click: () =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run(),
          },
          {
            label: 'Heading 3',
            click: () =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run(),
          },
        ],
      ]"
    >
      <UButton
        :label="
          editor?.isActive('heading', { level: 1 })
            ? 'Heading 1'
            : editor?.isActive('heading', { level: 2 })
            ? 'Heading 2'
            : 'Heading 3'
        "
        :size="'xs'"
        :color="'black'"
        class="rounded-sm"
        icon="i-heroicons-chevron-down"
      />
    </UDropdown>
    <UButton
      v-for="i in [
        {
          icon: 'i-heroicons-bold',
          tooltip: 'Bold',
          disabled: !editor?.can().chain().focus().toggleBold().run(),
          onClicked: () => editor?.chain().focus().toggleBold().run(),
          active: editor?.isActive('bold') === true,
        },
        {
          icon: 'i-heroicons-italic',
          tooltip: 'Italic',
          disabled: !editor?.can().chain().focus().toggleItalic().run(),
          onClicked: () => editor?.chain().focus().toggleItalic().run(),
          active: editor?.isActive('italic') === true,
        },
        {
          icon: 'i-heroicons-underline',
          tooltip: 'Underline',
          disabled: false,
          onClicked: () => editor?.chain().focus().toggleUnderline().run(),
          active: editor?.isActive('underline') === true,
        },
        {
          icon: 'material-symbols:format-list-bulleted-rounded',
          tooltip: 'Bullet List',
          disabled: false,
          onClicked: () => editor?.chain().focus().toggleBulletList().run(),
          active: editor?.isActive('bulletList') === true,
        },
        {
          icon: 'material-symbols:format-list-numbered',
          tooltip: 'Numbered List',
          disabled: false,
          onClicked: () => editor?.chain().focus().toggleOrderedList().run(),
          active: editor?.isActive('orderedList') === true,
        },
        {
          icon: 'material-symbols:format-strikethrough',
          tooltip: 'Strike',
          disabled: editor?.can().chain().focus().toggleStrike().run(),
          onClicked: () => editor?.chain().focus().toggleStrike().run(),
          active: editor?.isActive('strike') === true,
        },
        {
          icon: 'material-symbols:code',
          tooltip: 'Code',
          disabled: false,
          onClicked: () => editor?.chain().focus().toggleCode().run(),
          active: editor?.isActive('code') === true,
        },

        {
          icon: 'material-symbols:undo',
          tooltip: 'Undo',
          disabled: !editor?.can().chain().focus().undo().run(),
          onClicked: () => editor?.chain().focus().undo().run(),
          active: false,
        },
        {
          icon: 'material-symbols:redo',
          tooltip: 'Redo',
          disabled: !editor?.can().chain().focus().redo().run(),
          onClicked: () => editor?.chain().focus().redo().run(),
          active: false,
        },
        {
          icon: 'material-symbols-light:format-ink-highlighter-outline-rounded',
          tooltip: 'Highlight',
          disabled: false,
          onClicked: () => editor?.chain().focus().toggleHighlight().run(),
          active: editor?.isActive('highlight') === true,
        },
      ]"
      :icon="i.icon"
      dynamic
      size="2xs"
      class="rounded-sm px-1.5"
      color="black"
      :variant="i.active ? 'solid' : 'ghost'"
      @click="i.onClicked"
    />
    <UButton
      icon="material-symbols:add-photo-alternate-outline"
      color="black"
      variant="ghost"
      size="2xs"
      class="rounded-sm px-1.5"
      @click="emits('dialog')"
    />
    <UButton
      label="Version"
      color="blue"
      size="xs"
      variant="ghost"
      @click="emits('open')"
    />
  </div>
</template>

<style scoped></style>

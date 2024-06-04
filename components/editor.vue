<script lang="ts" setup>
import { HocuspocusProvider } from "@hocuspocus/provider";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HighLight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";

import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import type { Fragment } from "@tiptap/pm/model";
import * as TipTap from "@tiptap/vue-3";
import { isApiError } from "~/types/api/error";
import type { VFile } from "~/types/data/file";

const props = defineProps<{
  editorId: string;
  editable: boolean;
}>();

const emits = defineEmits(["open"]);
const model = defineModel<string>();

const editor = ref<TipTap.Editor>();
const app = useApp();
function getRandomColorHex(): string {
  const randomInt = Math.floor(Math.random() * 16777215);
  const hexString = randomInt.toString(16).padStart(6, "0");
  return `#${hexString}`;
}

watch(model, (val) => {
  console.log(val, "MAsuk", !editor.value?.isFocused);

  if (!editor.value?.isFocused) {
    editor.value?.commands.setContent(val ?? "<p></p>");
  }
});
onMounted(() => {
  const provider = new HocuspocusProvider({
    url: "ws://localhost:3100",
    name: props.editorId ?? "Test Editor Heheh",
  });
  type Levels = 1 | 2 | 3;

  const classes: Record<Levels, string> = {
    1: "text-4xl",
    2: "text-2xl",
    3: "text-xl",
  };

  const NewHeading = Heading.configure({
    levels: [1, 2, 3],
  }).extend({
    renderHTML({ node, HTMLAttributes }) {
      const hasLevel = this.options.levels.includes(node.attrs.level);
      const level: Levels = hasLevel
        ? node.attrs.level
        : this.options.levels[0];
      return [
        `h${level}`,
        TipTap.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `${classes[level]}`,
        }),
        0,
      ];
    },
  });

  const user = app.user?.name || "anonymous";
  editor.value = new TipTap.Editor({
    editorProps: {
      attributes: {
        class: "max-h-64 h-64 py-8",
      },
    },
    onUpdate: async ({ transaction, editor }) => {
      model.value = editor.getHTML();
      const getImageSrcs = (fragment: Fragment) => {
        let srcs = new Set<string>();
        fragment.forEach((node) => {
          if (node.type.name === "image") {
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
      let deletedImageSrcs = [...previousSrcs].filter(
        (src) => !currentSrcs.has(src)
      );
      if (deletedImageSrcs.length > 0) {
        console.log(deletedImageSrcs);
        for (const iterator of deletedImageSrcs) {
          const urls = iterator.replaceAll(
            useRuntimeConfig().public.FILE_URL,
            ""
          );
          await api.post(`/finding/upload/delete/${urls}`);
        }
      }
    },
    editable: props.editable,
    extensions: [
      Document,
      ListItem,
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
      HighLight.configure({
        HTMLAttributes: { class: "bg-orange-300 rounded-none px-0.5" },
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: user,
          color: getRandomColorHex(),
        },
      }),

      Collaboration.configure({
        document: provider.document,
      }),
    ],
  });
  model.value = editor.value.getHTML();
  editor.value.commands.setContent(model.value ?? "<p></p>");
});

const fileDialog = useFileDialog({
  directory: false,
  multiple: false,
  reset: true,
});

const notif = useNotification();
const api = usePrivateApi();

const upload = async (param: { files?: FileList | null }) => {
  try {
    const formData = new FormData();
    if (param.files && param.files.length > 0) {
      formData.append("file", param.files[0]);
      const data = await api.post<VFile>(
        `/finding/upload/${findingStore().id}`,
        {
          body: formData,
        }
      );

      if (data.data) {
        const url = await createUrlFile(data.data);

        editor.value
          ?.chain()
          .focus()
          .setImage({
            src: url + `?id=${data.data.id}&findingId=${findingStore().id}`,
          })
          .run();
      }

      notif.ok({
        title: "Success",
        message: "File" + " uploaded",
      });
      return;
    }
  } catch (error) {
    if (isApiError(error)) {
      notif.error({
        title: "Error",
        message: error.message,
      });
    } else {
      console.log(error);

      notif.error({
        title: "Error",
        message: "Try again later",
      });
    }
  }
};

fileDialog.onChange((files) =>
  upload({
    files,
  })
);

onBeforeRouteLeave(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="flex gap-1 flex-wrap" v-if="editor && props.editable">
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
      @click="fileDialog.open()"
    />
    <UButton
      label="Version"
      color="blue"
      size="xs"
      variant="ghost"
      @click="emits('open')"
    />
  </div>
  <div class="w-full bg-slate-200 max-h-64 h-64 rounded-lg dark:bg-slate-700">
    <TipTap.EditorContent :editor="editor" />
  </div>
</template>

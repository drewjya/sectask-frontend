<script lang="ts" setup>
import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { DocType } from "~/types/data/finding/finding";
import { extensions, getRandomColorHex } from "~/utils/editor/editor.utils";
import VersionsSlider from "./versions-slider.vue";

const props = defineProps<{
  editorId: string;
  isEditable: boolean;
  type: "DESCRIPTION" | "THREAT";
}>();
const api = useEPrivateApi();
const save = (id?: number) => {
  api.post(`/finding/versions/${store.id}?type=${props.type}`, {
    param: {
      body: {
        content: editor.value?.getHTML() ?? "",
        basedOnId: id,
      },
    },
  });
};

const runtime = useRuntimeConfig();
const editor = ref<Editor>();
const app = useApp();
const user = app.user?.name || "anonymous";
onMounted(() => {
  const provider = new HocuspocusProvider({
    url: runtime.public.HOCUSPOCUS,
    name: props.editorId ?? "Test Editor Heheh",
  });
  editor.value = new Editor({
    editable: props.isEditable,
    editorProps: {
      attributes: {
        class: "max-h-64 h-64 py-8",
      },
    },
    extensions: [
      ...extensions,
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
});
const store = findingStore();
const slider = useSlideover();
const openSldie = () => {
  slider.open(VersionsSlider, {
    findingId: store.id,
    onSelect: (value) => {
      editor.value?.commands.setContent(value.content);
      save(value.id);
      slider.close();
    },
    type: props.type === "DESCRIPTION" ? DocType.DESCRIPTION : DocType.THREAT,
  });
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <slot :text="editor?.getHTML()" ></slot>
    <EditorHelper
      :editor="editor"
      v-if="editor && isEditable"
      @open="openSldie()"
    />
    <div class="w-full bg-slate-200 max-h-64 h-64 rounded-lg dark:bg-slate-700">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<style scoped></style>

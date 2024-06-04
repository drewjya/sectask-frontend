import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import HighLight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { mergeAttributes, type Extensions } from "@tiptap/vue-3";
import Heading from "@tiptap/extension-heading";

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
    const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0];
    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `${classes[level]}`,
      }),
      0,
    ];
  },
});

export const extensions =[
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
    
]
  
export function getRandomColorHex(): string {
    const randomInt = Math.floor(Math.random() * 16777215);
    const hexString = randomInt.toString(16).padStart(6, "0");
    return `#${hexString}`;
  }
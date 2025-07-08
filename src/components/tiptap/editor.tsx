"use client";

import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";

import { FontSize } from "@/extensions/font-size";
import { useEditorStore } from "@/store/use-editor-store";
import { EditorContent, useEditor } from "@tiptap/react";
import { common, createLowlight } from "lowlight";

interface EditorProps {
  placeholder?: string;
  onContentChange?: (content: string) => void;
  onTextSelection?: (text: string, start: number, end: number) => void;
}

const Editor = ({
  placeholder = "Enter title here",
  onContentChange,
  onTextSelection,
}: EditorProps) => {
  const { setEditor } = useEditorStore();
  const lowlight = createLowlight();
  lowlight.register(common);

  const editor = useEditor({
    onCreate: ({ editor }) => {
      setEditor(editor);
    },
    onDestroy: () => {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
      if (onContentChange) {
        onContentChange(editor.getHTML());
      }
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
      if (onTextSelection) {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, "");
        onTextSelection(selectedText, from, to);
      }
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },

    editorProps: {
      attributes: {
        style: "",
        class:
          "focus:outline-none bg-transparent  min-h-10 w-full cursor-text prose prose-sm max-w-none",
      },
    },
    extensions: [
      StarterKit,
      FontSize,
      Heading,
      FontFamily,
      Color,
      Placeholder.configure({
        placeholder: placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextStyle,
      Code,
      ImageResize,
      Image,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      TaskItem.configure({ nested: true }),
      TaskList,
      Underline,
    ],
    content: "",
    immediatelyRender: false,
  });

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;

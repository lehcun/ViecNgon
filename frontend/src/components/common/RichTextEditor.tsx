"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // Class prose giúp format HTML tự động đẹp mắt
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Thanh công cụ (Toolbar) */}
      <div className="flex flex-wrap items-center gap-1 bg-gray-50 p-2 border-b border-gray-300">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-blue-600" : "text-gray-600"}`}
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-600"}`}
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-600"}`}
        >
          <Italic className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>{" "}
        {/* Đường phân cách */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-600"}`}
        >
          <List className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-200 text-blue-600" : "text-gray-600"}`}
        >
          <ListOrdered className="w-5 h-5" />
        </button>
      </div>

      {/* Vùng soạn thảo */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;

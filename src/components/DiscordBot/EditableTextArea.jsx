import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownEditor() {
  const [textValue, setTextValue] = useState("");
  const textareaRef = useRef(null);

  // A reusable function to wrap the selected text with start/end markers
  const wrapSelectedText = (start, end) => {
    if (!textareaRef.current) return;

    const { selectionStart, selectionEnd } = textareaRef.current;
    // If nothing is highlighted, do nothing
    if (selectionStart === selectionEnd) return;

    const before = textValue.slice(0, selectionStart);
    const selected = textValue.slice(selectionStart, selectionEnd);
    const after = textValue.slice(selectionEnd);

    // Wrap selection in the provided markers
    const newValue = `${before}${start}${selected}${end}${after}`;
    setTextValue(newValue);
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Markdown Editor</h2>

      {/* Toolbar: Bold, Italic, Strikethrough, etc. */}
      <div className="flex space-x-2 mb-2">
        {/* Bold */}
        <button
          type="button"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => wrapSelectedText("**", "**")}
        >
          Bold
        </button>

        {/* Italic */}
        <button
          type="button"
          className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          onClick={() => wrapSelectedText("_", "_")}
        >
          Italic
        </button>

        {/* Inline Code */}
        <button
          type="button"
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
          onClick={() => wrapSelectedText("`", "`")}
        >
          `code`
        </button>

        <button
          type="button"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => wrapSelectedText("**", "**")}
        >
          Role ID
        </button>
      </div>

      {/* Textarea for raw Markdown */}
      <textarea
        ref={textareaRef}
        rows={5}
        className="w-full p-2 mb-4 border-2 border-gray-300 focus:outline-none focus:border-blue-400 rounded"
        placeholder="Live Preview"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
      />

      {/* Live Preview */}
      <h3 className="font-bold mb-2">Live Preview:</h3>
      <div className="p-2 border rounded text-left bg-gray-100">
        {/*
          Replace single newlines (\n) with "  \n" so every Enter press
          is interpreted as a forced line break in Markdown.
        */}
        <ReactMarkdown>{textValue.replace(/\n/g, "  \n")}</ReactMarkdown>
      </div>
    </div>
  );
}
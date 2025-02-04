/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

export default function EditableTextArea({
  idx,
  resp,
  handleNewAutoRespFieldChange,
  RoleIDfetcher,
  textDescrition,
  header
}) {
  // Define preset messages before they are used
  const presetMessages = [
    { label: "Applied Role ID", value: `<@&${RoleIDfetcher}>` },
    { label: "Board Members", value: "<@&1146800443696095242>" },
    { label: "Committee Members", value: "<@&1250096796911538257>" },
    { label: "Social Media", value: "<@&1299674410155769916>" },
    { label: "Climbing Committee", value: "<@&1263260259087028324>" },
    { label: "Climbing", value: "<@&1150784194973274242>" },
    { label: "Boardgames Committee", value: "<@&1263260051158732952>" },
    { label: "Boardgamer", value: "<@&1150783727035756654>" },
    { label: "Swedish fun Committee", value: "<@&1290657070953136128>" },
    { label: "Swedish fun", value: "<@&1290656892883959849>" },
    { label: "Crafts Committee", value: "<@&1263260321200607285>" },
    { label: "Crafts", value: "<@&1150784132511711262>" },
    { label: "Hiker", value: "<@&1156916936354054144>" },
    { label: "Dev", value: "<@&1154023087860355184>" },
  ];
    

  const [textValue, setTextValue] = useState(resp.content || "");
  const textareaRef = useRef(null);
  const [selectedPreset, setSelectedPreset] = useState(presetMessages[0]);

  // Keep local state (textValue) in sync if parent changes resp.content externally
  useEffect(() => {
    setTextValue(resp.content || "");
  }, [resp.content]);

  // Helper function to wrap the selected text with start/end markers
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
    onChangeHandler(newValue);
  };

  // Helper function to insert text at the cursor (without wrapping)
  const insertTextAtCursor = (insertText) => {
    if (!textareaRef.current) return;

    const { selectionStart, selectionEnd } = textareaRef.current;
    const before = textValue.slice(0, selectionStart);
    const after = textValue.slice(selectionEnd);

    // Insert the given text at the cursor
    const newValue = before + insertText + after;
    onChangeHandler(newValue);

    // (Optional) set cursor position right after inserted text
    setTimeout(() => {
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
        selectionStart + insertText.length;
      textareaRef.current.focus();
    }, 0);
  };

  // Single onChange handler that updates local state and calls parent's callback
  const onChangeHandler = (newText) => {
    setTextValue(newText);
    handleNewAutoRespFieldChange(idx, "content", newText);
  };

  // Helper to escape RegExp special characters from a string.
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Transform role id mentions to their corresponding label.
  // This function only affects the live preview rendering.
  const transformRoleMentions = (text) => {
    let transformedText = text;
    presetMessages.forEach((preset) => {
      // Create a global regexp for the role mention
      const regex = new RegExp(escapeRegExp(preset.value), "g");
      transformedText = transformedText.replace(regex, preset.label);
    });
    return transformedText;
  };

  // Transform empty lines: replace lines that are completely empty with a non-breaking space.
  // This ensures that a blank line is rendered in the live preview.
  const transformEmptyLines = (text) => {
    return text
      .split("\n")
      .map((line) => (line.trim() === "" ? "\u00A0" : line))
      .join("\n");
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">{header}</h2>
      <p className="mb-6 p-4 text-gray-400 font-light">
        {textDescrition}
      </p>

      {/* Toolbar: Bold, Italic, Inline Code, and Role ID */}
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
          <code>code</code>
        </button>

        {/* Dropdown to select a different preset */}
        <select
          className="ml-2 w-32 px-2 py-1 border rounded"
          value={selectedPreset.label}
          onChange={(e) => {
            const found = presetMessages.find(
              (item) => item.label === e.target.value
            );
            if (found) {
              setSelectedPreset(found);
              // Immediately insert the selected preset's value
              insertTextAtCursor(found.value);
            }
          }}
        >
          {presetMessages.map((preset, index) => (
            <option key={index} value={preset.label}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      {/* Textarea for raw Markdown */}
      <textarea
        ref={textareaRef}
        rows={5}
        className="w-full p-2 mb-4 border-2 border-gray-300 focus:outline-none focus:border-blue-400 rounded"
        placeholder="Enter markdown here..."
        value={textValue}
        onChange={(e) => onChangeHandler(e.target.value)}
      />

      {/* Live Preview */}
      <h3 className="font-bold mb-2">Live Preview:</h3>
      <div className="p-2 border rounded text-left bg-gray-100">
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
          {transformEmptyLines(transformRoleMentions(textValue))}
        </ReactMarkdown>
      </div>
    </div>
  );
}
import { useRef, useState } from "react";

export default function MarkdownEditor() {
  const textareaRef = useRef(null);

  // Track the current text in local state
  const [textValue, setTextValue] = useState("");

  // Wrap highlighted text in "**"
  const makeBold = () => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;

    // Only proceed if something is selected
    if (selectionStart === selectionEnd) return;

    const before = textValue.slice(0, selectionStart);
    const selected = textValue.slice(selectionStart, selectionEnd);
    const after = textValue.slice(selectionEnd);

    // Insert "**" before and after selection
    const newValue = `${before}**${selected}**${after}`;
    setTextValue(newValue);
  };

  // Save the text to a JSON structure (or send to a server)
  const saveToJsonFile = () => {
    // For demonstration, build a JSON object with the text
    const dataToSave = {
      content: textValue,
      // You could include other fields here if you like
    };

    // In a real app, you'd do something like:
    //   fetch("/api/save-markdown", {
    //     method: "POST",
    //     headers: {"Content-Type": "application/json"},
    //     body: JSON.stringify(dataToSave)
    //   })
    //   .then(...)

    // For now, just log it
    console.log("JSON to be saved:", JSON.stringify(dataToSave, null, 2));
    alert("Check the console to see the JSON output!");
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Markdown Editor</h2>

      {/* Toolbar: Bold Button, etc. */}
      <div className="space-x-2 mb-2">
        <button
          onClick={makeBold}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Bold
        </button>

        <button
          onClick={saveToJsonFile}
          className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
        >
          Save
        </button>
      </div>

      {/* Textarea for live editing */}
      <textarea
        ref={textareaRef}
        rows={5}
        className="w-full p-2 border-2 border-gray-300 focus:outline-none focus:border-blue-400 rounded"
        placeholder="Type something here... Select text and click 'Bold' to wrap in **...**"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
      />

      {/* Optional: Live Preview */}
      <h3 className="mt-4 font-bold">Live Preview (raw markdown below):</h3>
      <div className="p-2 border rounded bg-gray-100 whitespace-pre-wrap">
        {textValue}
      </div>
    </div>
  );
}
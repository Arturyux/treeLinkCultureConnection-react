/* eslint-disable react/prop-types */
import { HexColorPicker } from "react-colorful";
import ColorPicker from "./ColorPicker";

/**
 * Receives all state and handler props from AdminPanel:
 * - links, setLinks
 * - newLink, setNewLink
 * - editIndex, setEditIndex
 * - editedLink, setEditedLink
 * - showAboutIndex, setShowAboutIndex
 * - showHexColorPicker, setShowHexColorPicker
 * - showRecommendedColorPicker, setShowRecommendedColorPicker
 * - handleAddLink, handleEditLink, handleSaveEdit, handleDeleteLink
 * - handleAboutLink, handleMoveUp, handleMoveDown
 */
function LinkTreeEditor({
  links,
  newLink,
  setNewLink,
  editIndex,
  editedLink,
  setEditedLink,
  showAboutIndex,
  showHexColorPicker,
  setShowHexColorPicker,
  showRecommendedColorPicker,
  setShowRecommendedColorPicker,
  handleAddLink,
  handleEditLink,
  handleSaveEdit,
  handleDeleteLink,
  handleAboutLink,
  handleMoveUp,
  handleMoveDown,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-4xl font-bold my-6">Link Tree Editing</h3>

      {/* Render each existing link with about/edit/delete/move-up/move-down */}
      {links.map((item, index) => (
        <div key={index}>
          {/* Link Preview */}
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <div
              className={`sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1 ${
                item.color.startsWith("#") ? "" : item.color
              }`}
              style={
                item.color.startsWith("#")
                  ? { backgroundColor: item.color }
                  : {}
              }
            >
              <p className={`text-xl font-bold ${item.textColor}`}>
                {item.text}
              </p>
            </div>
          </a>

          {/* Link Management Buttons */}
          <div className="flex justify-center space-x-4 mt-2 p-2">
            <button
              onClick={() => handleEditLink(index)}
              className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-all duration-200"
            >
              {editIndex === index ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={() => handleDeleteLink(index)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all duration-200"
            >
              Delete
            </button>
            <button
              onClick={() => handleAboutLink(index)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-200"
            >
              About
            </button>
            <button
              onClick={() => handleMoveUp(index)}
              disabled={index === 0}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
            >
              Up
            </button>
            <button
              onClick={() => handleMoveDown(index)}
              disabled={index === links.length - 1}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
            >
              Down
            </button>
          </div>

          {/* "About" Section */}
          {showAboutIndex === index && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-lg">
              <p>
                <strong>Color:</strong> {item.color}
              </p>
              <p>
                <strong>Text:</strong> {item.text}
              </p>
              <p>
                <strong>Link:</strong>{" "}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {item.link}
                </a>
              </p>
              <p>
                <strong>Text Color:</strong>{" "}
                {item.textColor === "text-white" ? "White" : "Black"}
              </p>
            </div>
          )}

          {/* "Edit Link" Section */}
          {editIndex === index && (
            <div className="sm:w-[70%] p-2 mx-auto bg-white py-10 mt-6 rounded-lg border-2 border-black focus:outline-none placeholder">
              <h4 className="text-4xl font-bold mb-2">Edit Link</h4>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-lg">Text</label>
                <input
                  type="text"
                  value={editedLink.text}
                  onChange={(e) =>
                    setEditedLink({ ...editedLink, text: e.target.value })
                  }
                  className="sm:w-96 mx-auto mt-2 text-center font-bold p-4 rounded py-3 border-2 border-black focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-lg">Link</label>
                <input
                  type="text"
                  value={editedLink.link}
                  onChange={(e) =>
                    setEditedLink({ ...editedLink, link: e.target.value })
                  }
                  className="sm:w-96 mx-auto mt-2 text-center font-bold p-4 rounded py-3 border-2 border-black focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-lg">
                  Text Color
                </label>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() =>
                      setEditedLink({ ...editedLink, textColor: "text-black" })
                    }
                    className="w-48 text-center p-2 rounded py-3 bg-gray-200 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
                  >
                    <p className="text-xl font-bold text-black">Black Text</p>
                  </button>
                  <button
                    onClick={() =>
                      setEditedLink({ ...editedLink, textColor: "text-white" })
                    }
                    className="w-48 text-center p-2 rounded py-3 bg-gray-700 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
                  >
                    <p className="text-xl font-bold text-white">White Text</p>
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveEdit}
                className="sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 bg-green-400 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
              >
                <p className="font-bold text-lg">Save Changes</p>
              </button>
            </div>
          )}
        </div>
      ))}

      {/* ADD NEW LINK SECTION */}
      <div className="sm:w-[70%] w-[97%] mx-auto bg-white py-10 mt-6 rounded-lg border-2 border-black focus:outline-none placeholder">
        <div className="mt-6">
          <h3 className="text-5xl font-semibold mb-4">Add New Link</h3>

          {/* New Link Preview */}
          <div className="mb-6">
            <a
              href={newLink.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className={`sm:w-96 w-[95%] mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1 ${
                  newLink.color.startsWith("#") ? "" : newLink.color
                }`}
                style={
                  newLink.color.startsWith("#")
                    ? { backgroundColor: newLink.color }
                    : {}
                }
              >
                <p className={`text-xl font-bold ${newLink.textColor}`}>
                  {newLink.text || "Preview"}
                </p>
              </div>
            </a>
          </div>

          {/* Color Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Tailwind color code or Hex code"
              value={newLink.color}
              onChange={(e) =>
                setNewLink({ ...newLink, color: e.target.value.trim() })
              }
              className="sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
            />
            <div className="flex justify-center p-3 space-x-4">
              <button
                onClick={() => {
                  setShowHexColorPicker(!showHexColorPicker);
                  setShowRecommendedColorPicker(false);
                }}
                className="w-48 mt-6 text-center p-2 bg-red-200 rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
              >
                <p className="text-xl font-bold">Hex</p>
              </button>
              <button
                onClick={() => {
                  setShowRecommendedColorPicker(!showRecommendedColorPicker);
                  setShowHexColorPicker(false);
                }}
                className="w-48 mt-6 text-center p-2 bg-green-400 rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
              >
                <p className="text-xl font-bold">Recommended</p>
              </button>
            </div>

            {/* Hex Color Picker Modal */}
            {showHexColorPicker && (
              <div className="mt-4 p-4">
                <HexColorPicker
                  color={newLink.color}
                  onChange={(color) => setNewLink({ ...newLink, color })}
                  className="mx-auto"
                />
                <div className="mt-2 text-center">
                  <button
                    onClick={() => setShowHexColorPicker(false)}
                    className="sm:w-96 mx-auto mt-6 text-center bg-green-400 rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
                  >
                    <p className="text-xl font-bold">Close</p>
                  </button>
                </div>
              </div>
            )}

            {/* Recommended Color Picker Modal */}
            {showRecommendedColorPicker && (
              <div className="mt-4 p-4 inline-block">
                <ColorPicker
                  onSelectColor={(colorClass) => {
                    setNewLink({ ...newLink, color: colorClass });
                    setShowRecommendedColorPicker(false);
                  }}
                />
                <div className="mt-2 text-center">
                  <button
                    onClick={() => setShowRecommendedColorPicker(false)}
                    className="sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 bg-green-400 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
                  >
                    <p className="text-xl font-bold">Close</p>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Text"
              value={newLink.text}
              onChange={(e) => setNewLink({ ...newLink, text: e.target.value })}
              className="placeholder font-bold sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
            />
          </div>

          {/* Text Color Buttons */}
          <div className="flex justify-center p-3 space-x-4">
            <button
              onClick={() =>
                setNewLink({ ...newLink, textColor: "text-black" })
              }
              className="w-48 text-center p-2 rounded py-3 bg-gray-200 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
            >
              <p className="text-xl font-bold text-black">Black Text</p>
            </button>
            <button
              onClick={() =>
                setNewLink({ ...newLink, textColor: "text-white" })
              }
              className="w-48 text-center p-2 rounded py-3 bg-gray-700 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
            >
              <p className="text-xl font-bold text-white">White Text</p>
            </button>
          </div>

          {/* Link URL Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Link https://"
              value={newLink.link}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (!inputValue.startsWith("https://")) {
                  setNewLink({ ...newLink, link: `https://${inputValue}` });
                } else {
                  setNewLink({ ...newLink, link: inputValue });
                }
              }}
              className="placeholder font-bold sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
            />
          </div>

          <button
            onClick={handleAddLink}
            className="sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 bg-blue-500 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
          >
            <p className="text-xl font-bold text-white">Add Button</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LinkTreeEditor;

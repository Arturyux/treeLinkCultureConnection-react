import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import ColorPicker from "./ColorPicker";
import SocialIcons from "./Socialmedia.jsx";
import CCLogo from "./assets/CCLogo.png";

function AdminPanel() {
  const [showHexColorPicker, setShowHexColorPicker] = useState(false);
  const [showRecommendedColorPicker, setShowRecommendedColorPicker] =
    useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ color: "", text: "", link: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editedLink, setEditedLink] = useState({
    color: "",
    text: "",
    link: "",
  });
  const [showAboutIndex, setShowAboutIndex] = useState(null);
  const navigate = useNavigate();

  const handleAboutLink = (index) => {
    setShowAboutIndex(showAboutIndex === index ? null : index);
  };

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetching links from the API
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${import.meta.env.VITE_API_URL}/links`)
        .then((response) => response.json())
        .then((data) => setLinks(data))
        .catch((error) => console.error("Error fetching links:", error));
    }
  }, [isAuthenticated]);

 // handleLogin function in AdminPanel component
const handleLogin = (e) => {
  e.preventDefault();

  // Send username and password to the server
  fetch(`${import.meta.env.VITE_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
      } else {
        alert("STOP");
      }
    })
    .catch((error) => {
      console.error("Error during authentication:", error);
      alert("Failed to login. Please try again.");
    });
};

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Add new link to the server
  const handleAddLink = () => {
    fetch(`${import.meta.env.VITE_API_URL}/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLink),
    })
      .then((response) => response.json())
      .then((data) => {
        setLinks([...links, data]);
        setNewLink({ color: "", text: "", link: "" });
      })
      .catch((error) => console.error("Error adding link:", error));
  };

  // Handle editing a link
  const handleEditLink = (index) => {
    if (editIndex === index) {
      setEditIndex(null);
      setEditedLink({ color: "", text: "", link: "" });
    } else {
      setEditIndex(index);
      setEditedLink(links[index]);
    }
  };

  const handleSaveEdit = () => {
    const updatedLink = { ...editedLink };

    fetch(`${import.meta.env.VITE_API_URL}/links/${editIndex}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedLink),
    })
      .then(() => {
        const updatedLinks = [...links];
        updatedLinks[editIndex] = updatedLink;
        setLinks(updatedLinks);
        setEditIndex(null);
        setEditedLink({ color: "", text: "", link: "" });
      })
      .catch((error) => console.error("Error saving link:", error));
  };

  const handleDeleteLink = (index) => {
    fetch(`${import.meta.env.VITE_API_URL}/links/${index}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedLinks = links.filter((_, i) => i !== index);
        setLinks(updatedLinks);
        if (editIndex === index) {
          setEditIndex(null);
          setEditedLink({ color: "", text: "", link: "" });
        }
      })
      .catch((error) => console.error("Error deleting link:", error));
  };
  

  if (!isAuthenticated) {
    return (  
      <div className="flex-col justify-center columns-1 items-center min-h-screen">
        <div className="h-70 w-70 mx-auto sm:w-96 sm:h-96">
          <div className="aspect-square">
            <img
              src={CCLogo}
              className="rounded-full"
              alt="Logo"
            />
          </div>
        </div>
          <div className="bg-white p-6 pb-10 w-96 mx-auto rounded-lg border-2 border-black focus:outline-none placeholder">
          <form onSubmit={handleLogin} className="text-center">
            <h2 className="text-2xl text-center font-bold">Admin Login</h2>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="sm:w-90 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none placeholder text-2xl"
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sm:w-90 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none placeholder text-2xl"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 py-3 w-[100%] text-center rounded border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1 text-2xl font-bold"
            >
              Log In
            </button>
          </form>
          </div>
          <SocialIcons />
      </div>
    );
  }
  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl font-semibold mb-4">Link Tree Editing</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded mb-4"
      >
        Log Out
      </button>
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Manage Links</h3>
        {links.map((item, index) => (
          <div key={index}>
            {/* Link button */}
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
                <p className="text-xl font-bold">{item.text}</p>
              </div>
            </a>

            {/* Edit, Delete, and About buttons */}
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
            </div>

            {/* About Section*/}
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
              </div>
            )}

            {/* Edit Section*/}
            {editIndex === index && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-lg">
                <h4 className="text-xl font-semibold mb-4">Edit Link</h4>
                <div className="mb-4">
                  <label className="block mb-2">Text</label>
                  <input
                    type="text"
                    value={editedLink.text}
                    onChange={(e) =>
                      setEditedLink({ ...editedLink, text: e.target.value })
                    }
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Link</label>
                  <input
                    type="text"
                    value={editedLink.link}
                    onChange={(e) =>
                      setEditedLink({ ...editedLink, link: e.target.value })
                    }
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Link Form */}
      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-4">Add New Link</h3>

        {/* Live Button Preview */}
        <div className="mb-6">
          <a
            href={newLink.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              className={`sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1 ${
                newLink.color.startsWith("#") ? "" : newLink.color
              }`}
              style={
                newLink.color.startsWith("#")
                  ? { backgroundColor: newLink.color }
                  : {}
              }
            >
              <p className="text-xl font-bold">{newLink.text || "Preview"}</p>
            </div>
          </a>
        </div>

        <div className="mb-4">
          <label className="block text-2xl font-semibold mb-4">Color</label>

          {/* Color Input Field */}
          <input
            type="text"
            placeholder="Enter Tailwind color code or Hex code"
            value={newLink.color}
            onChange={(e) =>
              setNewLink({ ...newLink, color: e.target.value.trim() })
            }
            className="sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
          />
          {/* Buttons for Color Picker Options */}
          <div className="flex justify-center mt-2 space-x-4">
            <button
              onClick={() => {
                setShowHexColorPicker(!showHexColorPicker);
                setShowRecommendedColorPicker(false);
              }}
              className={`px-4 py-2 bg-orange-200 rounded border-2 border-black`}
            >
              Hex
            </button>
            <button
              onClick={() => {
                setShowRecommendedColorPicker(!showRecommendedColorPicker);
                setShowHexColorPicker(false);
              }}
              className={`px-4 py-2 bg-orange-200 rounded border-2 border-black`}
            >
              Recommended
            </button>
          </div>

          {/* HexColorPicker */}
          {showHexColorPicker && (
            <div className="mt-4 p-4 border border-gray-300 rounded bg-white shadow-lg inline-block">
              <HexColorPicker
                color={newLink.color}
                onChange={(color) => setNewLink({ ...newLink, color })}
              />
              <div className="mt-2 text-center">
                <button
                  onClick={() => setShowHexColorPicker(false)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Custom ColorPicker */}
          {showRecommendedColorPicker && (
            <div className="mt-4 p-4 border border-gray-300 rounded bg-white shadow-lg inline-block">
              <ColorPicker
                onSelectColor={(colorClass) => {
                  setNewLink({ ...newLink, color: colorClass });
                  setShowRecommendedColorPicker(false);
                }}
              />
              <div className="mt-2 text-center">
                <button
                  onClick={() => setShowRecommendedColorPicker(false)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Text and Link Fields */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Text"
            value={newLink.text}
            onChange={(e) => setNewLink({ ...newLink, text: e.target.value })}
            className="placeholder font-bold sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Link https://"
            value={newLink.link}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Ensure the link always starts with 'https://'
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
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-200"
        >
          Add Link
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
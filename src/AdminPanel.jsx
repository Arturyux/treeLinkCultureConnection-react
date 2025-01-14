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
  const [newLink, setNewLink] = useState({
    color: "",
    text: "",
    link: "",
    textColor: "text-black",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editedLink, setEditedLink] = useState({
    color: "",
    text: "",
    link: "",
    textColor: "text-black",
  });
  const [showAboutIndex, setShowAboutIndex] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
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

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${import.meta.env.VITE_API_URL}/links`)
        .then((response) => response.json())
        .then((data) => setLinks(data))
        .catch((error) => console.error("Error fetching links:", error));
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
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
        setNewLink({ color: "", text: "", link: "", textColor: "text-black" });
      })
      .catch((error) => console.error("Error adding link:", error));
  };

  const handleEditLink = (index) => {
    if (editIndex === index) {
      setEditIndex(null);
      setEditedLink({ color: "", text: "", link: "", textColor: "text-black" });
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
        setEditedLink({ color: "", text: "", link: "", textColor: "text-black" });
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
          setEditedLink({ color: "", text: "", link: "", textColor: "text-black" });
        }
      })
      .catch((error) => console.error("Error deleting link:", error));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newLinks = [...links];
    [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
    setLinks(newLinks);
    updateLinksOrderOnServer(newLinks);
  };

  const handleMoveDown = (index) => {
    if (index === links.length - 1) return;
    const newLinks = [...links];
    [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    setLinks(newLinks);
    updateLinksOrderOnServer(newLinks);
  };

  const updateLinksOrderOnServer = (updatedLinks) => {
    fetch(`${import.meta.env.VITE_API_URL}/links/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedLinks),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-col justify-center columns-1 items-center min-h-screen">
        <div className="h-70 w-70 mx-auto sm:w-96 sm:h-96">
          <div className="aspect-square">
            <img src={CCLogo} className="rounded-full" alt="Logo" />
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
      <h2 className="text-5xl font-bold mb-4">Culture Connection Admin Panel!</h2>
      <div className=" space-x-4">
      <button
        onClick={handleLogout}
        className="sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 bg-red-500 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
      >
        <p className="font-bold text-lg text-white">Log Out</p>
      </button>
      <button
        onClick={() => setShowEditor(!showEditor)}
        className="sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 bg-gray-300 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
      >
        <p className="font-bold text-lg text-black">
          {showEditor ? "Hide Link Tree Editor" : "Show Link Tree Editor"}
        </p>
      </button>
      </div>
      {showEditor && (
        <div className="space-y-4">
          <h3 className="text-4xl font-bold my-6">Link Tree Editing</h3>
          {links.map((item, index) => (
            <div key={index}>
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
              {editIndex === index && (
                <div className="sm:w-[70%] w-[95%] mx-auto bg-white py-10 mt-6 rounded-lg border-2 border-black focus:outline-none placeholder">
                  <h4 className="text-4xl font-bold mb-2">Edit Link</h4>
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold text-lg">
                      Text
                    </label>
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
                    <label className="block mb-2 font-semibold text-lg">
                      Link
                    </label>
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
                        <p className={`text-xl font-bold text-black`}>
                          Black Text
                        </p>
                      </button>
                      <button
                        onClick={() =>
                          setEditedLink({ ...editedLink, textColor: "text-white" })
                        }
                        className="w-48 text-center p-2 rounded py-3 bg-gray-700 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
                      >
                        <p className={`text-xl font-bold text-white`}>
                          White Text
                        </p>
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
          <div className="sm:w-[70%] w-[95%] mx-auto bg-white py-10 mt-6 rounded-lg border-2 border-black focus:outline-none placeholder">
            <div className="mt-6">
              <h3 className="text-5xl font-semibold mb-4">Add New Link</h3>
              <div className="mb-6">
                <a
                  href={newLink.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className={`sm:w-96 w-auto mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1 ${
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
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowHexColorPicker(!showHexColorPicker);
                      setShowRecommendedColorPicker(false);
                    }}
                    className="w-48 mt-6 text-center p-2 bg-red-200 rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
                  >
                    <p className={`text-xl font-bold`}>Hex</p>
                  </button>
                  <button
                    onClick={() => {
                      setShowRecommendedColorPicker(!showRecommendedColorPicker);
                      setShowHexColorPicker(false);
                    }}
                    className="w-48 mt-6 text-center p-2 bg-green-400 rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
                  >
                    <p className={`text-xl font-bold`}>Recommended</p>
                  </button>
                </div>
                {showHexColorPicker && (
                  <div className="mt-4 p-4 ">
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
                        <p className={`text-xl font-bold`}>Close</p>
                      </button>
                    </div>
                  </div>
                )}
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
                        <p className={`text-xl font-bold`}>Close</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Text"
                  value={newLink.text}
                  onChange={(e) => setNewLink({ ...newLink, text: e.target.value })}
                  className="placeholder font-bold sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setNewLink({ ...newLink, textColor: "text-black" })}
                  className="w-48 text-center p-2 rounded py-3 bg-gray-200 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
                >
                  <p className={`text-xl font-bold text-black`}>Black Text</p>
                </button>
                <button
                  onClick={() => setNewLink({ ...newLink, textColor: "text-white" })}
                  className="w-48 text-center p-2 rounded py-3 bg-gray-700 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
                >
                  <p className={`text-xl font-bold text-white`}>White Text</p>
                </button>
              </div>
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
                <p className={`text-xl font-bold text-white`}>Add Button</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
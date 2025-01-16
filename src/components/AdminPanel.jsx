import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPanel from "./LoginPanel";
import LinkTreeEditor from "./LinkTree/LinkTreeEditor.jsx";
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

  const handleAboutLink = (index) => {
    setShowAboutIndex(showAboutIndex === index ? null : index);
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
        setNewLink({
          color: "",
          text: "",
          link: "",
          textColor: "text-black",
        });
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
        setEditedLink({
          color: "",
          text: "",
          link: "",
          textColor: "text-black",
        });
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
          setEditedLink({
            color: "",
            text: "",
            link: "",
            textColor: "text-black",
          });
        }
      })
      .catch((error) => console.error("Error deleting link:", error));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newLinks = [...links];
    [newLinks[index - 1], newLinks[index]] = [
      newLinks[index],
      newLinks[index - 1],
    ];
    setLinks(newLinks);
    updateLinksOrderOnServer(newLinks);
  };

  const handleMoveDown = (index) => {
    if (index === links.length - 1) return;
    const newLinks = [...links];
    [newLinks[index], newLinks[index + 1]] = [
      newLinks[index + 1],
      newLinks[index],
    ];
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
      <LoginPanel
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        SocialIcons={SocialIcons}
        CCLogo={CCLogo}
      />
    );
  }
  return (
    <div className="p-6 text-center">
      <h2 className="text-5xl font-bold mb-4">
        Culture Connection Admin Panel!
      </h2>
      <div className="space-x-4">
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

      {/* Toggle Link Tree Editor */}
      {showEditor && (
        <LinkTreeEditor
          // Pass link data + states:
          links={links}
          setLinks={setLinks}
          newLink={newLink}
          setNewLink={setNewLink}
          editIndex={editIndex}
          setEditIndex={setEditIndex}
          editedLink={editedLink}
          setEditedLink={setEditedLink}
          showAboutIndex={showAboutIndex}
          setShowAboutIndex={setShowAboutIndex}
          showHexColorPicker={showHexColorPicker}
          setShowHexColorPicker={setShowHexColorPicker}
          showRecommendedColorPicker={showRecommendedColorPicker}
          setShowRecommendedColorPicker={setShowRecommendedColorPicker}
          // Pass callback methods:
          handleAddLink={handleAddLink}
          handleEditLink={handleEditLink}
          handleSaveEdit={handleSaveEdit}
          handleDeleteLink={handleDeleteLink}
          handleAboutLink={handleAboutLink}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
        />
      )}
    </div>
  );
}

export default AdminPanel;

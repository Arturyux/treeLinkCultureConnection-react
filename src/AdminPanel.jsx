import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ color: '', text: '', link: '' });
  const [editIndex, setEditIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    fetch('/links.json')
      .then(response => response.json())
      .then(data => setLinks(data))
      .catch(error => console.error('Error fetching links:', error));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleAddLink = () => {
    setLinks([...links, newLink]);
    setNewLink({ color: '', text: '', link: '' });
  };

  const handleEditLink = (index) => {
    setNewLink(links[index]);
    setEditIndex(index);
  };

  const handleSaveEdit = () => {
    const updatedLinks = [...links];
    updatedLinks[editIndex] = newLink;
    setLinks(updatedLinks);
    setNewLink({ color: '', text: '', link: '' });
    setEditIndex(null);
  };

  const handleDeleteLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl mb-4 text-center">Admin Login</h2>
          <div className="mb-4">
            <label className="block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
            Log In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl mb-4">Admin Dashboard</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded mb-4">
        Log Out
      </button>

      {/* Link Management Section */}
      <div>
        <h3 className="text-2xl mb-4">Manage Links</h3>
        {links.map((link, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
            <p className="mb-2">Color: {link.color}</p>
            <p className="mb-2">Text: {link.text}</p>
            <p className="mb-2">Link: {link.link}</p>
            <button
              onClick={() => handleEditLink(index)}
              className="bg-yellow-500 text-white p-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteLink(index)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      <div className="mt-6">
        <h3 className="text-2xl mb-4">{editIndex !== null ? 'Edit Link' : 'Add New Link'}</h3>
        <div className="mb-4">
          <label className="block mb-2">Color</label>
          <input
            type="text"
            value={newLink.color}
            onChange={(e) => setNewLink({ ...newLink, color: e.target.value })}
            className="border border-gray-300 p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Text</label>
          <input
            type="text"
            value={newLink.text}
            onChange={(e) => setNewLink({ ...newLink, text: e.target.value })}
            className="border border-gray-300 p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Link</label>
          <input
            type="text"
            value={newLink.link}
            onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
            className="border border-gray-300 p-2 w-full"
          />
        </div>
        <button
          onClick={editIndex !== null ? handleSaveEdit : handleAddLink}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {editIndex !== null ? 'Save Changes' : 'Add Link'}
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
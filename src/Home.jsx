import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import SocialIcons from "./Socialmedia.jsx";
import ConfettiComponent from "./ConfettiComponent";
import CCLogo from "./assets/CCLogo.png";

function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [links, setLinks] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState(null);
  const navigate = useNavigate();

  const handleClick = () => {
    setShowConfetti(true);
    setClickCount((prevCount) => prevCount + 1);
    setTimeout(() => setShowConfetti(false), 10000);
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      setClickCount(0);
    }, 2000);
    setTimer(newTimer);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/links`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLinks(data);
      })
      .catch((error) => console.error("Error fetching links:", error));
  }, []);

  useEffect(() => {
    if (clickCount === 5) {
      navigate("/admincc");
    }
  }, [clickCount, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <ConfettiComponent triggerConfetti={showConfetti} />
      <div className="max-w-xl mx-auto p-6">
        <div className="h-70 w-70 mx-auto sm:w-96 sm:h-96">
          <div className="aspect-square">
            <img
              src={CCLogo}
              className="rounded-full object-cover object-center cursor-pointer"
              onClick={handleClick}
              alt="Logo"
            />
          </div>
        </div>
        {links.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
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
              <p className={`text-xl font-bold ${item.textColor}`}>{item.text}</p>
            </div>
          </a>
        ))}
        <SocialIcons />
      </div>
    </div>
  );
}

export default Home;

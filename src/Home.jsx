import { useState, useEffect } from 'react';
import './App.css';
import SocialIcons from './Socialmedia.jsx';
import ConfettiComponent from './ConfettiComponent';
import CCLogo from './assets/CCLogo.png';

function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [links, setLinks] = useState([]);

  const handleClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 10000);
  };

  useEffect(() => {
    fetch('/links.json')
      .then(response => response.json())
      .then(data => {
        setLinks(data);
      })
      .catch(error => console.error('Error fetching links:', error));
  }, []);

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <ConfettiComponent triggerConfetti={showConfetti} />
      <div className='max-w-xl mx-auto p-6'>
        <div className='h-70 w-70 mx-auto sm:w-96 sm:h-96'>
          <div className='aspect-square'>
            <img
              src={CCLogo}
              className='rounded-full object-cover object-center cursor-pointer'
              onClick={handleClick}
              alt='Logo'
            />
          </div>
        </div>
        {links.map((item, index) => (
          <a key={index} href={item.link} target='_blank'>
            <div className={`sm:w-96 mx-auto ${item.color} mt-6 text-center p-4 rounded py-3 border-2 border-black shadow-custom sm:w-64 hover:shadow-none transition-all hover:translate-x-1 translate-y-1`}>
              <p className='text-xl font-bold'>
                {item.text}
              </p>
            </div>
          </a>
        ))}
        <SocialIcons />
      </div>
    </div>
  );
}

export default Home;
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

// eslint-disable-next-line react/prop-types
const ConfettiComponent = ({ triggerConfetti }) => {
  const [conOpacity, setConOpacity] = useState(1);

  useEffect(() => {
    if (triggerConfetti) {
      const opacityInterval = setInterval(() => {
        setConOpacity((prev) => Math.max(prev - 0.02, 0));
      }, 100);

      const stopConfetti = setTimeout(() => {
        clearInterval(opacityInterval); 
      }, 10000);

      return () => {
        clearTimeout(stopConfetti);
        clearInterval(opacityInterval);
      };
    } else {
      setConOpacity(1);
    }
  }, [triggerConfetti]);

  if (!triggerConfetti) return null;

  return (
    <Confetti
      numberOfPieces={500}
      opacity={conOpacity} 
    />
  );
};

export default ConfettiComponent;
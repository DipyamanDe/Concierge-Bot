import React, { useState, useEffect } from 'react';
 
 
const sentences = [
  "Welcome to Your Virtual Haven! How may I assist you today?",
  "Checking in or checking out, I'm here to make your stay stress-free!",
  "Your wishes are my commands. Let's make your stay extraordinary!",
  "Need a helping hand? I'm your 24/7 digital concierge!",
  "Unlock the magic of your stay with our friendly bot at your service.",
  "From pillow preferences to local hotspots, I've got it all covered!",
  "Navigate your stay effortlessly awith our high-tech hospitality bot.",
  "Hospitality at your fingertips! How can I make your stay splendid?",
  "More than just a chat – your personal hotel genie awaits!",
  "Your comfort, your way. Let's craft the perfect stay together!"
];
 
const AnimatedText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
 
  useEffect(() => {
    if (currentIndex < sentences.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 3000); // Change the text every 3 seconds
 
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);
 
  return (
    <div className="text-container">
      <p className="animated-text">
        {sentences[currentIndex]}
      </p>
    </div>
  );
};
 
export default AnimatedText;
import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "" }) => {
  const [glitchedText, setGlitchedText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGlitching) {
      interval = setInterval(() => {
        setGlitchedText(
          text
            .split("")
            .map((char, index) => {
              if (Math.random() > 0.9) {
                return characters[Math.floor(Math.random() * characters.length)];
              }
              return char;
            })
            .join("")
        );
      }, 50);
    } else {
      setGlitchedText(text);
    }

    return () => clearInterval(interval);
  }, [isGlitching, text]);

  return (
    <span 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
    >
      <span className="relative z-10">{glitchedText}</span>
      {isGlitching && (
        <>
          <span className="absolute top-0 left-0 -z-10 text-primary opacity-70 animate-pulse" style={{ transform: 'translate(-2px, 1px)' }}>{glitchedText}</span>
          <span className="absolute top-0 left-0 -z-10 text-red-500 opacity-70 animate-pulse" style={{ transform: 'translate(2px, -1px)' }}>{glitchedText}</span>
        </>
      )}
    </span>
  );
};

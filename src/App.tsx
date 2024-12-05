import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./App.css";
import { GameProvider } from "./contexts/GameContext";
import { GameBoard } from "./components/GameBoard/GameBoard";

const App: React.FC = () => {
  const [logoType, setLogoType] = useState<string>("image");
  const [xPos, setXPos] = useState<number>(0);
  const [yPos, setYPos] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);

  const logoText = "Lyreco";
  const asciiArt = `
 _  __   ______  _____ ____ ___
| | \\ \\ / /  _ \\| ____/ ___/ _ \\
| |  \\ V /| |_) |  _|| |  | | | |
| |___| | |  _ <| |__| |__| |_| |
|_____|_| |_| \\_\\_____\\____\\___/
  `;

  // Fonction pour déplacer le logo de façon aléatoire
  const moveLogo = () => {
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 200;
    setXPos(Math.floor(Math.random() * maxX));
    setYPos(Math.floor(Math.random() * maxY));
  };

  // Fonction pour changer le type du logo de manière aléatoire
  const changeLogoType = () => {
    const randomType = Math.floor(Math.random() * 3);
    setLogoType(
      randomType === 0 ? "image" : randomType === 1 ? "ascii" : "text"
    );
    moveLogo();
  };

  // Fonction d'animation au clic
  const animateLogo = () => {
    moveLogo();
    setScale(1.5);
    setRotate(Math.floor(Math.random() * 360));
    triggerConfetti();
    setTimeout(() => {
      setScale(1);
      setRotate(0);
    }, 1000);
  };

  // Déclencher des confettis
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ff9900"],
    });
  };

  useEffect(() => {
    changeLogoType();
    const intervalId = setInterval(() => {
      changeLogoType();
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <GameProvider>
      <div className="game-container">
        {/* Votre composant GameBoard */}
        <GameBoard />

        {/* Logo dynamique */}
        <div
          onClick={animateLogo}
          style={{
            position: "absolute",
            left: `${xPos}px`,
            top: `${yPos}px`,
            transform: `scale(${scale}) rotate(${rotate}deg)`,
            transition: "all 1s ease",
            fontFamily: "monospace",
            cursor: "pointer",
            zIndex: 999,
          }}
          className="logo"
        >
          {logoType === "image" && (
            <img src="/lyreco.png" alt="Logo Lyreco" className="logo-image" />
          )}
          {logoType === "ascii" && <pre>{asciiArt}</pre>}
          {logoType === "text" && <span className="logo-text">{logoText}</span>}
        </div>
      </div>
    </GameProvider>
  );
};

export default App;

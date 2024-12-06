import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./App.css";
import { GameProvider } from "./contexts/GameContext";
import { GameBoard } from "./components/GameBoard/GameBoard";

const App: React.FC = () => {
    const [xPos, setXPos] = useState<number>(
        Math.floor(Math.random() * (window.innerWidth - 100))
    );
    const [yPos, setYPos] = useState<number>(
        Math.floor(Math.random() * (window.innerHeight - 100))
    );
    const [currentLogo, setCurrentLogo] = useState<string>("lyreco1.png");
    const [visible, setVisible] = useState<boolean>(true);

    const logos = ["lyreco1.png", "lyreco2.png", "lyreco3.png"] as const;

    const moveLogo = () => {
        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 100;
        setXPos(Math.random() * maxX);
        setYPos(Math.random() * maxY);
    };

    const getRandomLogo = (): string => {
        return logos[Math.floor(Math.random() * logos.length)] || "lyreco1.png";
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setCurrentLogo(getRandomLogo());
                moveLogo();
                setVisible(true);
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <GameProvider>
            <div className="game-container">
                <GameBoard/>
                <div
                    style={{
                        left: `${xPos}px`,
                        top: `${yPos}px`,
                    }}
                    className={`logo ${!visible ? "hidden" : ""}`}
                    onClick={() => confetti()}
                >
                    <img
                        src={currentLogo}
                        alt="Logo Lyreco"
                        className="logo-image"
                    />
                </div>
            </div>
        </GameProvider>
    );
};

export default App;
import React from "react";
import "./App.css";
import { GameProvider } from "./contexts/GameContext";
import { GameBoard } from "./components/GameBoard/GameBoard";

const App: React.FC = () => {
    return (
        <GameProvider>
            <div className="game-container">
                <GameBoard />
            </div>
        </GameProvider>
    );
};

export default App;

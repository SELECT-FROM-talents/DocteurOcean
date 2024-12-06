import React, { useState } from "react";
import { Clinic } from "./CreditsClinic";
import CreditsIMTeo from "./CreditsIMTeo";
import CreditsPWLeon from "./CreditsPWLeon";
import "./CreditsGameBoard.css";

export const CreditsGameBoard = () => {
    const [currentScene, setCurrentScene] = useState<"CLINIC" | "CREDITS_IM_TEO" | "CREDITS_PW_LEON">("CLINIC");

    const handleDialogEnd = () => {
        setTimeout(() => setCurrentScene("CREDITS_IM_TEO"), 500); // Transition après 500ms
    };

    const handleCreditsIMTeoEnd = () => {
        setCurrentScene("CREDITS_PW_LEON");
    };

    const renderScene = () => {
        console.log("Rendering scene:", currentScene);
        switch (currentScene) {
            case "CLINIC":
                return <Clinic onDialogEnd={handleDialogEnd} />;
            case "CREDITS_IM_TEO":
                return <CreditsIMTeo onGameEnd={handleCreditsIMTeoEnd} />;
            case "CREDITS_PW_LEON":
                return <CreditsPWLeon />;
            default:
                return <div>Scène inconnue</div>;
        }
    };

    return (
        <div className="credits-game-board">
            {renderScene()}
            <div className="game-ui">
                <div>Scène actuelle : {currentScene}</div>
            </div>
        </div>
    );
};

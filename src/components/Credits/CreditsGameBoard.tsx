
import { Clinic } from "./CreditsClinic";
import CreditsIMTeo from "./CreditsIMTeo";
import CreditsPWLeon from "./CreditsPWLeon";
import CreditsCBQuentin from "./CreditsCBQuentin";
import "./CreditsGameBoard.css";
import {useState} from "react";

export const CreditsGameBoard = () => {
    const [currentScene, setCurrentScene] = useState<"CLINIC" | "CREDITS_IM_TEO" | "CREDITS_PW_LEON" | "CREDITS_CB_QUENTIN">("CLINIC");

    const handleDialogEnd = () => {
        setTimeout(() => setCurrentScene("CREDITS_IM_TEO"), 500); // Transition après 500ms
    };

    const handleCreditsIMTeoEnd = () => {
        setCurrentScene("CREDITS_PW_LEON");
    };

    const handleCreditsPWLeon = () => {
        setCurrentScene("CREDITS_CB_QUENTIN");
    }

    const handleCreditsCBQuentin = () => {
        setCurrentScene("CREDITS_CB_QUENTIN");
    }

    const renderScene = () => {
        console.log("Rendering scene:", currentScene);
        switch (currentScene) {
            case "CLINIC":
                return <Clinic onDialogEnd={handleDialogEnd} />;
            case "CREDITS_IM_TEO":
                return <CreditsIMTeo onGameEnd={handleCreditsIMTeoEnd} />;
            case "CREDITS_PW_LEON":
                return <CreditsPWLeon onGameEnd={handleCreditsPWLeon} />;
            case "CREDITS_CB_QUENTIN":
                return <CreditsCBQuentin onGameEnd={handleCreditsCBQuentin} />;
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

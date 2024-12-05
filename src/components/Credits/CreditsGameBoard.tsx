import React, { useState } from 'react';
import { Clinic } from './CreditsClinic';
import { DreamWorld } from '../DreamWorld/DreamWorld';
import './CreditsGameBoard.css';

export const CreditsGameBoard = () => {
    const [currentScene, setCurrentScene] = useState<'CLINIC' | 'DREAM_WORLD'>('CLINIC');
    const [startTimer, setStartTimer] = useState(false);

    // Activer le timer une fois le dialogue terminé
    React.useEffect(() => {
        if (startTimer) {
            const timer = setTimeout(() => {
                setCurrentScene('DREAM_WORLD');
            }, 500); // 5000 ms avant de changer de scène

            return () => clearTimeout(timer);
        }
    }, [startTimer]);

    const handleDialogEnd = () => {
        setStartTimer(true); // Déclenche le timer après le dialogue
    };

    const renderScene = () => {
        switch (currentScene) {
            case 'CLINIC':
                return <Clinic onDialogEnd={handleDialogEnd} />;
            case 'DREAM_WORLD':
                return <DreamWorld />;
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

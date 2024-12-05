import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import Dialogue from './Dialogue';
import PlasticWasteGame from './PlasticWasteGame';
import './PlasticWasteDream.css';

const PlasticWasteDream: React.FC = () => {
    const { state } = useGame();
    const [showDialogue, setShowDialogue] = useState(true);
    const [showGame, setShowGame] = useState(false);

    const handleDialogueEnd = () => {
        setShowDialogue(false);
        setShowGame(true);
    };

    const handleGameEnd = (score: number) => {
        setShowGame(false);
    };

    return (
        <div className="plastic-waste-dream">
            {showDialogue && (
                <Dialogue
                    doctorDialogue={[
                        'Bienvenue dans le DreamWorld. Ici, nous pouvons voir que votre corps est comme un vaste océan, mais il est malheureusement envahi par des déchets plastiques.',
                        'Ces débris qui flottent représentent la pollution qui affecte votre santé, tout comme elle menace nos écosystèmes marins.',
                        'Pour vous guérir, nous devons nettoyer cet océan intérieur. Chaque déchet collecté est un pas vers la guérison.',
                        'Vous avez 30 secondes pour ramasser un maximum de déchets. Plus vous en collecterez, plus votre océan - et donc votre santé - sera purifié.'
                    ]}
                    patientDialogue={[
                        'Je comprends maintenant le lien entre ma santé et celle des océans...',
                        'Je suis prêt à me battre pour nettoyer mon océan intérieur !',
                        'Ensemble, nous pouvons faire la différence, pour ma santé et celle de nos mers.'
                    ]}
                    onDialogueEnd={handleDialogueEnd}
                />
            )}
            {showGame && <PlasticWasteGame onGameEnd={handleGameEnd} />}
        </div>
    );
};

export default PlasticWasteDream;
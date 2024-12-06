import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import Dialogue from './Dialogue';
import IceMeltingGame from './IceMeltingGame';
import './IceMeltingDream.css';

const IceMeltingDream: React.FC = () => {
    const {} = useGame();
    const [showDialogue, setShowDialogue] = useState(true);
    const [showGame, setShowGame] = useState(false);

    const handleDialogueEnd = () => {
        setShowDialogue(false);
        setShowGame(true);
    };

    const handleGameEnd = () => {
        setShowGame(false);
    };

    return (
        <div className="plastic-waste-dream">
            {showDialogue && (
                <Dialogue
                    doctorDialogue={[
                        'Bienvenue dans le DreamWorld. Ici, nous pouvons voir que votre corps est comme un vaste océan, mais il est malheureusement sous l\'emprise de la fonte des glaces.',
                        'Ces grands, que dis-je, ces immenses blocs de glaces qui rétrécisse jusqu\'à disparaître est à l\'océan ce que vos pertes de tissus sont à votre corps.',
                        'Pour vous guérir, nous devons réguler cet océan intérieur. Chaque pavé glacé refroidit est un pas vers la guérison.',
                        'Vous avez 30 secondes pour protéger des pavés de glace de la fonte. Plus il vous en reste, plus votre océan - et donc votre santé - sera purifié.'
                    ]}
                    patientDialogue={[
                        'Que voulez-vous dire ?',
                        'Je comprends maintenant le lien entre ma santé et celle des océans...',
                        'Je suis prêt à me battre pour réguler mon océan intérieur !',
                        'Ensemble, nous pouvons faire la différence, pour ma santé et celle de nos mers.'
                    ]}
                    onDialogueEnd={handleDialogueEnd}
                />
            )}
            {showGame && <IceMeltingGame onGameEnd={handleGameEnd} />}
        </div>
    );
};

export default IceMeltingDream;
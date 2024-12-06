// src/components/DreamWorld/CORAL_BREATHING/CoralBreathingDream.tsx
import { useGame } from '@/contexts/GameContext';
import Dialogue from './Dialogue';
import CoralBreathingGame from './CoralBreathingGame';
import './CoralBreathingDream.css';
import {useState} from "react";

export default function CoralBreathingDream() {
    useGame();
    const [showDialogue, setShowDialogue] = useState(true);
    const [showGame, setShowGame] = useState(false);

    const handleDialogueEnd = () => {
        setShowDialogue(false);
        setShowGame(true);
    };



    return (
        <div className="coral-breathing-dream">
            {showDialogue && (
                <Dialogue
                    doctorDialogue={[
                        'Bienvenue dans le DreamWorld. Nous allons explorer aujourd\'hui le lien profond entre vos poumons et le Grand Récif de Corail.',
                        'Regardez : tout comme vos poumons filtrent l\'air et produisent l\'oxygène nécessaire à votre corps, les coraux sont les poumons de nos océans.',
                        'Malheureusement, votre habitude de fumer a endommagé vos poumons, tout comme la pollution et le réchauffement climatique détruisent nos récifs coralliens.',
                        'Pour guérir, nous devons restaurer l\'équilibre. Vous allez aider les coraux à respirer et à produire de l\'oxygène, comme un exercice de respiration pour vos propres poumons.',
                        'Plus vous maintiendrez le rythme de respiration des coraux, plus vos poumons se régénéreront en harmonie avec eux.'
                    ]}
                    patientDialogue={[
                        'Je n\'avais jamais pensé que mes poumons et les coraux avaient tant en commun...',
                        'C\'est vrai que quand je fume, j\'ai du mal à respirer, comme ces coraux étouffés par la pollution.',
                        'Je suis prêt à réapprendre à respirer, pour moi et pour les océans.',
                        'Montrez-moi comment je peux aider les coraux à respirer.'
                    ]}
                    onDialogueEnd={handleDialogueEnd}
                />
            )}
            {showGame && <CoralBreathingGame/>}
        </div>
    );
}
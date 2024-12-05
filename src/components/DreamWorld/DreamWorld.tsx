// src/components/DreamWorld/DreamWorld.tsx
import { useGame } from '@/contexts/GameContext';
import './DreamWorld.css';
import {setDreamState} from "@/utils/gameHelpers.ts";

export const DreamWorld = () => {
    const { state } = useGame();
    const activePatient = state.activePatient;

    console.log('State:', state);
    console.log('Active Patient:', activePatient);
    console.log('Dream State:', activePatient?.dreamState);

    if (!activePatient || !activePatient.dreamState) {
        // Passer le patient en mode rêve
        setDreamState(true);
        return <div className="dream-world-scene">Aucun patient actif dans l'état de rêve.</div>;
    }

    return (
        <div className="dream-world-scene">
            <div className="dream-world-background">
                <h2>Le Monde des Rêves</h2>
                {activePatient.oceanMetaphor.type === 'POLLUTION' && (
                    <div className="pollution-dream">
                        <h3>Pollution</h3>
                        <p>Ce rêve représente une infection. Aidez le patient à nettoyer la pollution pour guérir.</p>
                        {/* Ajoutez ici la logique et les éléments visuels pour le rêve de pollution */}
                    </div>
                )}
                {activePatient.oceanMetaphor.type === 'CORAL_BLEACHING' && (
                    <div className="coral-bleaching-dream">
                        <h3>Blanchiment des coraux</h3>
                        <p>Ce rêve représente une inflammation. Aidez le patient à restaurer les récifs coralliens pour guérir.</p>
                        {/* Ajoutez ici la logique et les éléments visuels pour le rêve de blanchiment des coraux */}
                    </div>
                )}
                {activePatient.oceanMetaphor.type === 'PLASTIC_WASTE' && (
                    <div className="plastic-waste-dream">
                        <h3>Déchets plastiques</h3>
                        <p>Ce rêve représente des corps étrangers. Aidez le patient à éliminer les déchets pour guérir.</p>
                        {/* Ajoutez ici la logique et les éléments visuels pour le rêve de déchets plastiques */}
                    </div>
                )}
                {activePatient.oceanMetaphor.type === 'ACIDIFICATION' && (
                    <div className="acidification-dream">
                        <h3>Acidification</h3>
                        <p>Ce rêve représente un déséquilibre. Aidez le patient à rétablir l'équilibre des eaux pour guérir.</p>
                        {/* Ajoutez ici la logique et les éléments visuels pour le rêve d'acidification */}
                    </div>
                )}
                {activePatient.oceanMetaphor.type === 'ICE_MELTING' && (
                    <div className="ice-melting-dream">
                        <h3>Fonte des glaces</h3>
                        <p>Ce rêve représente une perte de tissu. Aidez le patient à stabiliser la température pour guérir.</p>
                        {/* Ajoutez ici la logique et les éléments visuels pour le rêve de fonte des glaces */}
                    </div>
                )}
            </div>
        </div>
    );
};
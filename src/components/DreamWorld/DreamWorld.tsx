import { useGame } from '@/contexts/GameContext';
import './DreamWorld.css';
import { PollutionDream } from "@/components/DreamWorld/POLLUTION/PollutionDream.tsx";
import { CoralBleachingDream } from "@/components/DreamWorld/CORAL_BLEACHING/CoralBleachingDream.tsx";
import { AcidificationDream } from "@/components/DreamWorld/ACIDIFICATION/AcidificationDream.tsx";
import IceMeltingDream from "@/components/DreamWorld/ICE_MELTING/IceMeltingDream.tsx";
import PlasticWasteDream from "@/components/DreamWorld/PLASTIC_WASTE/PlasticWasteDream.tsx";
import { useEffect } from 'react';

export const DreamWorld = () => {
    const { state, dispatch } = useGame();
    const activePatient = state.activePatient;

    useEffect(() => {
        if (!activePatient || !activePatient.dreamState) {
            dispatch({ type: 'SET_DREAM_STATE', payload: true });
        }
    }, [activePatient, dispatch]);

    if (!activePatient || !activePatient.dreamState) {
        return <div className="dream-world-scene">Aucun patient actif dans l'état de rêve.</div>;
    }

    return (
        <div className="dream-world-scene">
            <div className="dream-world-background">
                <h2>Le Monde des Rêves</h2>
                {activePatient.oceanMetaphor.type === 'POLLUTION' && <PollutionDream />}
                {activePatient.oceanMetaphor.type === 'CORAL_BLEACHING' && <CoralBleachingDream />}
                {activePatient.oceanMetaphor.type === 'PLASTIC_WASTE' && <PlasticWasteDream />}
                {activePatient.oceanMetaphor.type === 'ACIDIFICATION' && <AcidificationDream />}
                {activePatient.oceanMetaphor.type === 'ICE_MELTING' && <IceMeltingDream />}
            </div>
        </div>
    );
};
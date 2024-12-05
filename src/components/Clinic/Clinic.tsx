import { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Position, Patient, CharacterState, HealthCondition, OceanMetaphorType } from '@/types/game.types';
import { generatePatient } from '@/utils/gameHelpers';
import { useClickInteraction } from '@/hooks/useClickInteraction';
import { Doctor } from './Doctor';
import { WaitingRoom } from './WaitingRoom';
import './Clinic.css';

export const Clinic = () => {
    const { state, dispatch } = useGame();
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const handlePatientClick = (patient: Patient) => {
        if (state.isPaused) return;
        setSelectedPatient(patient);
        // Position le docteur près du patient
        const doctorPosition: Position = {
            x: patient.position.x - 80,
            y: patient.position.y
        };
        dispatch({ type: 'MOVE_DOCTOR', payload: doctorPosition });
    };

    const handleStartTreatment = () => {
        if (!selectedPatient) return;
        dispatch({
            type: 'UPDATE_PATIENT',
            payload: {
                id: selectedPatient.id,
                updates: {
                    state: CharacterState.DREAMING,
                }
            }
        });
        dispatch({ type: 'TOGGLE_DREAM_WORLD' });
    };

    // Génère des patients périodiquement
    useEffect(() => {
        if (state.patients.length >= 5) return; // Maximum 5 patients en attente

        const interval = setInterval(() => {
            if (state.patients.length < 5 && !state.isPaused) {
                const newPatient = generatePatient(state.patients.length);
                dispatch({ type: 'ADD_PATIENT', payload: newPatient });
            }
        }, 5000); // Nouveau patient toutes les 5 secondes

        return () => clearInterval(interval);
    }, [state.patients.length, state.isPaused]);

    return (
        <div className="clinic-scene">
            <div className="clinic-background">
                <div className="reception-desk">
                    <h3>Réception</h3>
                </div>

                <WaitingRoom
                    patients={state.patients}
                    onPatientClick={handlePatientClick}
                    selectedPatient={selectedPatient}
                />

                <Doctor
                    position={state.doctor.position}
                    state={state.doctor.state}
                />

                {selectedPatient && (
                    <div className="patient-dialog">
                        <h4>{selectedPatient.name}</h4>
                        <p>État: {selectedPatient.condition}</p>
                        {selectedPatient.oceanMetaphor && (
                            <p>Métaphore: {selectedPatient.oceanMetaphor.type}</p>
                        )}
                        <button
                            className="treatment-button"
                            onClick={handleStartTreatment}
                        >
                            Commencer le traitement
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
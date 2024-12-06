import { useEffect, useState, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import {DialogContent, Patient, Position} from '@/types/game.types';
import { generatePatient } from '@/utils/gameHelpers';
import { WaitingRoom } from './WaitingRoom';
import { Doctor } from './Doctor';
import { PatientDialog } from './PatientDialog';
import { useClickInteraction } from '@/hooks/useClickInteraction';
import './Clinic.css';

export const Clinic = () => {
    const { state, dispatch } = useGame();
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [dialogStep, setDialogStep] = useState(0);
    const [isMoving, setIsMoving] = useState(false);

    const handleSceneClick = useCallback((position: Position) => {
        if (state.isPaused || isMoving) return;

        setIsMoving(true);
        dispatch({ type: 'MOVE_DOCTOR', payload: position });

        setTimeout(() => {
            setIsMoving(false);
        }, 1000);
    }, [state.isPaused, isMoving, dispatch]);

    const { handleClick } = useClickInteraction({
        onInteraction: handleSceneClick,
    });

    const handlePatientClick = useCallback(async (patient: Patient) => {
        if (state.isPaused || isMoving) return;

        setSelectedPatient(patient);
        dispatch({ type: 'SELECT_ACTIVE_PATIENT', payload: patient });

        const doctorPosition: Position = {
            x: patient.position.x - 100,
            y: patient.position.y
        };

        setIsMoving(true);
        dispatch({ type: 'MOVE_DOCTOR', payload: doctorPosition });

        setTimeout(() => {
            setIsMoving(false);
            setDialogStep(1);
        }, 1000);
    }, [state.isPaused, isMoving, dispatch]);

    const handleDialogProgress = useCallback(() => {
        if (dialogStep < 3) {
            setDialogStep(prev => prev + 1);
        } else {
            handleStartDream();
        }
    }, [dialogStep]);

    const handleStartDream = useCallback(() => {
        if (!selectedPatient) return;
        setDialogStep(0);
        dispatch({ type: 'TOGGLE_DREAM_WORLD' });
    }, [selectedPatient, dispatch]);

    const getDialogContent = useCallback((): DialogContent | null => {
        if (!selectedPatient) return null;

        const dialogs: DialogContent[] = [
            {
                text: `Bonjour ${selectedPatient.name}, je suis le Dr. Ocean. Comment vous sentez-vous ?`,
                speaker: 'doctor'
            },
            {
                text: `Je ne me sens pas très bien... Mon corps me semble comme un océan troublé.`,
                speaker: 'patient'
            },
            {
                text: `Je comprends. Je vois que votre océan intérieur montre des signes de ${selectedPatient.oceanMetaphor.type}. 
                  Voulez-vous explorer cela ensemble ?`,
                speaker: 'doctor'
            },
            {
                text: `Pour vous guérir, vous devrez plonger dans votre océan intérieur et le soigner vous-même. 
                  Êtes-vous prêt pour ce voyage ?`,
                speaker: 'doctor'
            }
        ];

        return dialogs[dialogStep] ?? null;
    }, [selectedPatient, dialogStep]);

    useEffect(() => {
        if (state.waitingPatients.length >= 5) return;

        const interval = setInterval(() => {
            if (state.waitingPatients.length < 5 && !state.isPaused) {
                const newPatient = generatePatient(state.waitingPatients.length);
                dispatch({ type: 'ADD_WAITING_PATIENT', payload: newPatient });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [state.waitingPatients.length, state.isPaused, dispatch]);

    return (
        <div className="clinic-scene">
            <div className="clinic-background">
                <div className="clinic-header">
                    <h3>Clinique du Dr. Ocean</h3>
                    <p>Un voyage intérieur vers la guérison</p>
                </div>

                <div className="main-area" onClick={handleClick}>
                    <Doctor
                        position={state.doctor.position}
                        state={state.doctor.state}
                        isMoving={isMoving}
                    />
                    <WaitingRoom
                        patients={state.waitingPatients}
                        onPatientClick={handlePatientClick}
                        selectedPatient={selectedPatient}
                    />
                </div>

                {selectedPatient && dialogStep > 0 && (
                    <PatientDialog
                        dialog={getDialogContent()}
                        onContinue={handleDialogProgress}
                        patient={selectedPatient}
                        isLastStep={dialogStep === 3}
                    />
                )}

                <div className="game-ui">
                    <div className="score">Score: {state.score}</div>
                    <div className="stats">
                        Patients guéris: {state.stats.patientsHealed}
                        <br/>
                        Temps: {Math.floor(state.stats.timeElapsed / 60)}:
                        {(state.stats.timeElapsed % 60).toString().padStart(2, '0')}
                    </div>
                </div>
            </div>
        </div>
    );
};
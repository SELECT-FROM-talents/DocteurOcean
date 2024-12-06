import { useState, useCallback } from 'react';
import { Patient, HealthCondition, OceanMetaphorType, CharacterState, DialogContent } from '@/types/game.types';
import { WaitingRoom } from '../Clinic/WaitingRoom';
import { Doctor } from '../Clinic/Doctor';
import { PatientDialog } from '../Clinic/PatientDialog';
import './CreditsClinic.css';

interface ClinicProps {
    onDialogEnd: () => void;
}

export const Clinic = ({ onDialogEnd }: ClinicProps) => {
    const [patients] = useState<Patient[]>([
        {
            id: 'credit-1',
            type: 'PATIENT',
            name: 'Hugo',
            condition: HealthCondition.DEV,
            position: { x: 100, y: 200 },
            size: { width: 48, height: 48 },
            state: CharacterState.IDLE,
            isInteractive: true,
            dreamState: false,
            dreamPowers: [],
            healingProgress: 0,
            oceanMetaphor: {
                type: OceanMetaphorType.CREDITS,
                severity: 0,
                solutions: [],
                currentProgress: 0
            }
        },
        {
            id: 'credit-2',
            type: 'PATIENT',
            name: 'Ilias',
            condition: HealthCondition.DEV,
            position: { x: 200, y: 300 },
            size: { width: 48, height: 48 },
            state: CharacterState.IDLE,
            isInteractive: true,
            dreamState: false,
            dreamPowers: [],
            healingProgress: 0,
            oceanMetaphor: {
                type: OceanMetaphorType.CREDITS,
                severity: 0,
                solutions: [],
                currentProgress: 0
            }
        },
        {
            id: 'credit-3',
            type: 'PATIENT',
            name: 'Léon',
            condition: HealthCondition.DEV,
            position: { x: 300, y: 400 },
            size: { width: 48, height: 48 },
            state: CharacterState.IDLE,
            isInteractive: true,
            dreamState: false,
            dreamPowers: [],
            healingProgress: 0,
            oceanMetaphor: {
                type: OceanMetaphorType.CREDITS,
                severity: 0,
                solutions: [],
                currentProgress: 0
            }
        },
        {
            id: 'credit-4',
            type: 'PATIENT',
            name: 'Quentin',
            condition: HealthCondition.DEV,
            position: { x: 400, y: 500 },
            size: { width: 48, height: 48 },
            state: CharacterState.IDLE,
            isInteractive: true,
            dreamState: false,
            dreamPowers: [],
            healingProgress: 0,
            oceanMetaphor: {
                type: OceanMetaphorType.CREDITS,
                severity: 0,
                solutions: [],
                currentProgress: 0
            }
        },
        {
            id: 'credit-5',
            type: 'PATIENT',
            name: 'Téo',
            condition: HealthCondition.DEV,
            position: { x: 500, y: 600 },
            size: { width: 48, height: 48 },
            state: CharacterState.IDLE,
            isInteractive: true,
            dreamState: false,
            dreamPowers: [],
            healingProgress: 0,
            oceanMetaphor: {
                type: OceanMetaphorType.CREDITS,
                severity: 0,
                solutions: [],
                currentProgress: 0
            }
        }
    ]);

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [dialogStep, setDialogStep] = useState(0);

    const handlePatientClick = useCallback((patient: Patient) => {
        setSelectedPatient(patient);
        setDialogStep(1);
    }, []);

    const handleDialogProgress = useCallback(() => {
        if (dialogStep < 3) {
            setDialogStep(prev => prev + 1);
        } else {
            setDialogStep(0);
            setSelectedPatient(null);
            onDialogEnd();
        }
    }, [dialogStep, onDialogEnd]);

    const getDialogContent = useCallback((): DialogContent | null => {
        if (!selectedPatient || dialogStep === 0) return null;

        const dialogs: DialogContent[] = [
            {
                text: `Bonjour ${selectedPatient.name}, je suis le Dr. Ocean. Comment vous sentez-vous ?`,
                speaker: 'doctor'
            },
            {
                text: `Très bien ! Mon corps me semble comme un océan nettoyé.`,
                speaker: 'patient'
            },
            {
                text: `Je comprends. Je vois que votre océan intérieur montre des signes de ${selectedPatient.oceanMetaphor.type}.
                Montrez nous de quoi il s'agît !`,
                speaker: 'doctor'
            }
        ];

        return dialogs[dialogStep - 1] ?? null;
    }, [selectedPatient, dialogStep]);

    return (
        <div className="clinic-scene">
            <div className="clinic-background">
                <div className="left-panel">
                    <div className="reception-desk">
                        <h3>Clinique du Dr. Ocean</h3>
                        <p>Un voyage intérieur vers la guérison</p>
                    </div>

                    <WaitingRoom
                        patients={patients}
                        onPatientClick={handlePatientClick}
                        selectedPatient={selectedPatient}
                    />
                </div>

                <div className="main-area">
                    <Doctor
                        position={{ x: 0, y: 0 }}
                        state={CharacterState.IDLE}
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
                    <div className="score">Score: 100</div>
                    <div className="stats">
                        Patients guéris: 3
                        <br />
                        Temps: 12:34
                    </div>
                </div>
            </div>
        </div>
    );
};
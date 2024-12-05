import { useState, useCallback } from 'react';
import { Patient } from '@/types/game.types';
import { WaitingRoom } from '../Clinic/WaitingRoom';
import { Doctor } from '../Clinic/Doctor';
import { PatientDialog } from '../Clinic/PatientDialog';
import './CreditsClinic.css';

export const Clinic = ({ onDialogEnd }) => {
    const [patients] = useState<Patient[]>([
        {
            id: 1,
            name: 'Hugo',
            condition: 'DEV',
            position: { x: 100, y: 200 },
            oceanMetaphor: { type: 'Crédits' },
        },
        {
            id: 2,
            name: 'Ilias',
            condition: 'DEV',
            position: { x: 200, y: 300 },
            oceanMetaphor: { type: 'Crédits' },
        },
        {
            id: 3,
            name: 'Léon',
            condition: 'DEV',
            position: { x: 300, y: 400 },
            oceanMetaphor: { type: 'Crédits' },
        },
        {
            id: 4,
            name: 'Quentin',
            condition: 'DEV',
            position: { x: 400, y: 500 },
            oceanMetaphor: { type: 'Crédits' },
        },
        {
            id: 5,
            name: 'Téo',
            condition: 'DEV',
            position: { x: 500, y: 600 },
            oceanMetaphor: { type: 'Crédits' },
        },
    ]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [dialogStep, setDialogStep] = useState(0);

    const handlePatientClick = useCallback((patient: Patient) => {
        setSelectedPatient(patient);
        setDialogStep(1); // Démarre le dialogue
    }, []);

    const handleDialogProgress = useCallback(() => {
        if (dialogStep < 3) {
            setDialogStep((prev) => prev + 1); // Étape suivante
        } else {
            setDialogStep(0);
            setSelectedPatient(null);
            onDialogEnd(); // Appeler onDialogEnd lorsque le dialogue est terminé
        }
    }, [dialogStep, onDialogEnd]);

    const getDialogContent = useCallback(() => {
        if (!selectedPatient) return null;

        const dialogs = [
            {
                text: '',
                speaker: 'patient',
            },
            {
                text: `Bonjour ${selectedPatient.name}, je suis le Dr. Ocean. Comment vous sentez-vous ?`,
                speaker: 'doctor',
            },
            {
                text: `Très bien ! Mon corps me semble comme un océan nettoyé.`,
                speaker: 'patient',
            },
            {
                text: `Je comprends. Je vois que votre océan intérieur montre des signes de ${selectedPatient.oceanMetaphor.type}.
                Montrez nous de quoi il s'agît !`,
                speaker: 'doctor',
            },
        ];

        return dialogs[dialogStep];
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
                    <Doctor position={{ x: 0, y: 0 }} state="IDLE" />
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

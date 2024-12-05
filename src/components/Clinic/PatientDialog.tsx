import { Patient } from '@/types/game.types';
import './PatientDialog.css';

interface DialogContent {
    text: string;
    speaker: 'doctor' | 'patient';
}

interface PatientDialogProps {
    dialog: DialogContent | null;
    onContinue: () => void;
    patient: Patient;
    isLastStep: boolean;
}

export const PatientDialog = ({ dialog, onContinue, patient, isLastStep }: PatientDialogProps) => {
    if (!dialog) return null;

    return (
        <>
            <div className="dialog-overlay" />
            <div className={`dialog-window speaker-${dialog.speaker}`}>
                <div className="dialog-inner">
                    <div className="dialog-top">
                        <span className="dialog-speaker">
                            {dialog.speaker === 'doctor' ? 'Dr. Ocean' : patient.name}
                        </span>
                    </div>

                    <div className="dialog-message">
                        {dialog.text}
                    </div>

                    <button
                        className={`dialog-continue ${isLastStep ? 'start-dream' : ''}`}
                        onClick={onContinue}
                    >
                        {isLastStep ? 'Commencer le voyage' : 'Continuer'}
                    </button>
                </div>
            </div>
        </>
    );
};
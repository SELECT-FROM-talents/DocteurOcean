import { Patient } from '@/types/game.types';
import './WaitingRoom.css';

interface WaitingRoomProps {
    patients: Patient[];
    selectedPatient: Patient | null;
    onPatientClick: (patient: Patient) => void;
}

export const WaitingRoom = ({
                                patients,
                                selectedPatient,
                                onPatientClick
                            }: WaitingRoomProps) => {
    return (
        <div className="waiting-room">
            <h3>Salle d'attente</h3>
            <div className="patients-container">
                {patients.map((patient) => (
                    <div
                        key={patient.id}
                        className={`patient-item ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                        onClick={() => onPatientClick(patient)}
                    >
                        <div className="patient-avatar" style={{
                            backgroundColor: getConditionColor(patient.condition)
                        }} />
                        <div className="patient-info">
                            <span className="patient-name">{patient.name}</span>
                            <span className="patient-condition">{patient.condition}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getConditionColor = (condition: string): string => {
    switch (condition) {
        case 'INFECTED':
            return '#ff4444';
        case 'HEALING':
            return '#ffbb33';
        case 'HEALTHY':
            return '#00C851';
        default:
            return '#2BBBAD';
    }
};
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
            <div className="patients-grid">
                {patients.map((patient) => (
                    <div
                        key={patient.id}
                        className={`patient-item ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                        onClick={() => onPatientClick(patient)}
                    >
                        <div className="patient-avatar">
                            👤
                        </div>
                        <div className="patient-info">
                            <span className="patient-name">{patient.name}</span>
                            <span className={`patient-status status-${patient.condition.toLowerCase()}`}>
                                {patient.condition}
                            </span>
                            <div className="ocean-metaphor">
                                <strong>{patient.oceanMetaphor.type}</strong>
                                <br />
                                <small>Severity: {patient.oceanMetaphor.severity}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
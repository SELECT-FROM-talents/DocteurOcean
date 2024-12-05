import { CharacterState } from '@/types/game.types';
import './Doctor.css';

interface DoctorProps {
    position: {
        x: number;
        y: number;
    };
    state: CharacterState;
}

export const Doctor = ({ position, state }: DoctorProps) => {
    const getStateClass = () => {
        switch (state) {
            case CharacterState.WALKING:
                return 'walking';
            case CharacterState.HEALING:
                return 'healing';
            case CharacterState.DREAMING:
                return 'dreaming';
            default:
                return 'idle';
        }
    };

    return (
        <div
            className={`doctor ${getStateClass()}`}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            <div className="doctor-sprite" />
            {state === CharacterState.HEALING && (
                <div className="healing-effect" />
            )}
        </div>
    );
};
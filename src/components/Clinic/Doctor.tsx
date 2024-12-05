import { CharacterState } from '@/types/game.types';
import './Doctor.css';

interface DoctorProps {
    position: {
        x: number;
        y: number;
    };
    state: CharacterState;
    isMoving?: boolean;
}

export const Doctor = ({ position, state, isMoving }: DoctorProps) => {
    const getStateClass = () => {
        if (isMoving) return 'walking';
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
            {(state === CharacterState.HEALING) && (
                <div className="healing-effect" />
            )}
        </div>
    );
};
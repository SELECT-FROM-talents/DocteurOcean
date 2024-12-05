import { createContext, useReducer, useContext, ReactNode } from 'react';
import {
    GameState,
    GameScene,
    Position,
    Patient,
    Doctor,
    CharacterState,
    GameStats,
    GameDifficulty
} from '@/types/game.types';

type GameAction =
    | { type: 'CHANGE_SCENE'; payload: GameScene }
    | { type: 'MOVE_DOCTOR'; payload: Position }
    | { type: 'ADD_PATIENT'; payload: Patient }
    | { type: 'UPDATE_PATIENT'; payload: { id: string; updates: Partial<Patient> } }
    | { type: 'UPDATE_SCORE'; payload: number }
    | { type: 'TOGGLE_PAUSE' }
    | { type: 'TOGGLE_DREAM_WORLD' }
    | { type: 'UPDATE_STATS'; payload: Partial<GameStats> }
    | { type: 'UPDATE_DIFFICULTY'; payload: GameDifficulty };

const initialDoctor: Doctor = {
    id: 'doctor-1',
    type: 'DOCTOR',
    name: 'Dr. Ocean',
    position: { x: 0, y: 0 },
    size: { width: 64, height: 64 },
    state: CharacterState.IDLE,
    isInteractive: false,
    healingPower: 1
};

const initialStats: GameStats = {
    patientsHealed: 0,
    totalScore: 0,
    timeElapsed: 0,
    successRate: 100
};

const initialState: GameState = {
    currentScene: GameScene.MAIN_MENU,
    doctor: initialDoctor,
    patients: [],
    score: 0,
    isPaused: false,
    dreamWorldActive: false,
    currentLevel: 1,
    difficulty: GameDifficulty.NORMAL,
    stats: initialStats
};

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'CHANGE_SCENE':
            return {
                ...state,
                currentScene: action.payload
            };

        case 'MOVE_DOCTOR':
            return {
                ...state,
                doctor: {
                    ...state.doctor,
                    position: action.payload,
                    state: CharacterState.WALKING
                }
            };

        case 'ADD_PATIENT':
            return {
                ...state,
                patients: [...state.patients, action.payload]
            };

        case 'UPDATE_PATIENT':
            return {
                ...state,
                patients: state.patients.map(patient =>
                    patient.id === action.payload.id
                        ? { ...patient, ...action.payload.updates }
                        : patient
                )
            };

        case 'UPDATE_SCORE':
            const newScore = action.payload;
            return {
                ...state,
                score: newScore,
                stats: {
                    ...state.stats,
                    totalScore: state.stats.totalScore + (newScore - state.score)
                }
            };

        case 'TOGGLE_PAUSE':
            return {
                ...state,
                isPaused: !state.isPaused
            };

        case 'TOGGLE_DREAM_WORLD':
            return {
                ...state,
                dreamWorldActive: !state.dreamWorldActive
            };

        case 'UPDATE_STATS':
            return {
                ...state,
                stats: {
                    ...state.stats,
                    ...action.payload
                }
            };

        default:
            return state;
    }
}

const GameContext = createContext<{
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
}>({
    state: initialState,
    dispatch: () => null
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
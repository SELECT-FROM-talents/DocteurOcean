import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import {
    GameState,
    GameScene,
    Patient,
    Doctor,
    CharacterState,
    DreamPower, Position
} from '@/types/game.types';

type GameAction =
    | { type: 'CHANGE_SCENE'; payload: GameScene }
    | { type: 'SELECT_ACTIVE_PATIENT'; payload: Patient }
    | { type: 'MOVE_DOCTOR'; payload: Position }
    | { type: 'UPDATE_PATIENT_PROGRESS'; payload: { progress: number } }
    | { type: 'USE_DREAM_POWER'; payload: { power: DreamPower } }
    | { type: 'UPDATE_OCEAN_SOLUTION'; payload: { solutionId: string; isCompleted: boolean } }
    | { type: 'ADD_WAITING_PATIENT'; payload: Patient }
    | { type: 'UPDATE_SCORE'; payload: number }
    | { type: 'TOGGLE_PAUSE' }
    | { type: 'TOGGLE_DREAM_WORLD' }
    | { type: 'SHOW_TUTORIAL' }
    | { type: 'SHOW_CREDITS' }
    | { type: 'SHOW_ABOUT' }
    | { type: 'SET_DREAM_STATE'; payload: boolean };

const initialDoctor: Doctor = {
    id: 'doctor-1',
    type: 'DOCTOR',
    name: 'Dr. Ocean',
    position: { x: 0, y: 0 },
    size: { width: 64, height: 64 },
    state: CharacterState.IDLE,
    isInteractive: false,
    dialogues: [
        "Bienvenue dans votre monde intérieur.",
        "Utilisez vos pouvoirs pour guérir votre océan.",
        "Chaque problème a sa solution, prenez votre temps."
    ]
};

const initialState: GameState = {
    currentScene: GameScene.MAIN_MENU,
    activePatient: null,
    doctor: initialDoctor,
    waitingPatients: [],
    score: 0,
    isPaused: false,
    dreamWorldActive: false,
    stats: {
        patientsHealed: 0,
        totalScore: 0,
        timeElapsed: 0,
        successRate: 100
    }
};

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'CHANGE_SCENE':
            return {
                ...state,
                currentScene: action.payload
            };
        case 'SHOW_TUTORIAL':
            return {
                ...state,
                currentScene: GameScene.TUTORIAL
            };
        case 'SHOW_CREDITS':
            return {
                ...state,
                currentScene: GameScene.CREDITS
            };
        case 'SHOW_ABOUT':
            return {
                ...state,
                currentScene: GameScene.ABOUT
            };
        case 'SELECT_ACTIVE_PATIENT':
            return {
                ...state,
                activePatient: action.payload
            };

        case 'UPDATE_PATIENT_PROGRESS':
            if (!state.activePatient) return state;
            return {
                ...state,
                activePatient: {
                    ...state.activePatient,
                    healingProgress: action.payload.progress
                }
            };

        case 'USE_DREAM_POWER':
            // Logique pour utiliser un pouvoir dans le monde des rêves
            return state;

        case 'MOVE_DOCTOR':
            return {
                ...state,
                doctor: {
                    ...state.doctor,
                    position: action.payload,
                    state: CharacterState.WALKING
                }
            };

        case 'UPDATE_OCEAN_SOLUTION':
            if (!state.activePatient?.oceanMetaphor) return state;
            return {
                ...state,
                activePatient: {
                    ...state.activePatient,
                    oceanMetaphor: {
                        ...state.activePatient.oceanMetaphor,
                        solutions: state.activePatient.oceanMetaphor.solutions.map(
                            solution => solution.id === action.payload.solutionId
                                ? { ...solution, isCompleted: action.payload.isCompleted }
                                : solution
                        )
                    }
                }
            };

        case 'ADD_WAITING_PATIENT':
            return {
                ...state,
                waitingPatients: [...state.waitingPatients, action.payload]
            };

        case 'UPDATE_SCORE':
            return {
                ...state,
                score: action.payload,
                stats: {
                    ...state.stats,
                    totalScore: state.stats.totalScore + action.payload
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
                dreamWorldActive: !state.dreamWorldActive,
                currentScene: !state.dreamWorldActive ? GameScene.DREAM_WORLD : GameScene.CLINIC
            };

        case 'SET_DREAM_STATE':
            return {
                ...state,
                activePatient: {
                    ...state.activePatient,
                    dreamState: action.payload,
                } as Patient,
            };


        default:
            return state;
    }
}

const GameContext = createContext<{
    state: GameState;
    dispatch: React.Dispatch<any>;
}>({
    state: initialState,
    dispatch: () => null,
});

export const GameProvider: React.FC = ({ children }) => {
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
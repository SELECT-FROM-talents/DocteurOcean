import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import {GameState, GameScene, CharacterState} from '@/types/game.types';
import { GameAction } from '@/types/gameActions.types';

// Type pour le contexte
interface GameContextType {
    state: GameState;
    dispatch: Dispatch<GameAction>;
}

// Props pour le Provider
interface GameProviderProps {
    children: ReactNode;
}

// État initial du jeu
const initialState: GameState = {
    currentScene: GameScene.MAIN_MENU,
    activePatient: null,
    doctor: {
        id: 'doctor-1',
        type: 'DOCTOR',
        name: 'Dr. Ocean',
        position: { x: 400, y: 300 },
        size: { width: 48, height: 48 },
        state: CharacterState.IDLE,
        isInteractive: true,
        dialogues: []
    },
    waitingPatients: [],
    score: 0,
    isPaused: false,
    dreamWorldActive: false,
    stats: {
        patientsHealed: 0,
        totalScore: 0,
        timeElapsed: 0,
        successRate: 0
    }
};

// Création du contexte
const GameContext = createContext<GameContextType | undefined>(undefined);

// Reducer pour gérer les actions
const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'SET_SCENE':
            return {
                ...state,
                currentScene: action.payload
            };
        case 'SET_ACTIVE_PATIENT':
        case 'SELECT_ACTIVE_PATIENT':
            return {
                ...state,
                activePatient: action.payload
            };
        case 'SET_DREAM_STATE':
            if (state.activePatient) {
                return {
                    ...state,
                    activePatient: {
                        ...state.activePatient,
                        dreamState: action.payload
                    }
                };
            }
            return state;
        case 'SET_WAITING_PATIENTS':
            return {
                ...state,
                waitingPatients: action.payload
            };
        case 'ADD_WAITING_PATIENT':
            return {
                ...state,
                waitingPatients: [...state.waitingPatients, action.payload]
            };
        case 'MOVE_DOCTOR':
            return {
                ...state,
                doctor: {
                    ...state.doctor,
                    position: action.payload
                }
            };
        case 'TOGGLE_DREAM_WORLD':
            return {
                ...state,
                dreamWorldActive: !state.dreamWorldActive,
                currentScene: !state.dreamWorldActive ? GameScene.DREAM_WORLD : GameScene.CLINIC
            };
        case 'SET_SCORE':
            return {
                ...state,
                score: action.payload
            };
        case 'SET_PAUSED':
            return {
                ...state,
                isPaused: action.payload
            };
        case 'SET_DREAM_WORLD_ACTIVE':
            return {
                ...state,
                dreamWorldActive: action.payload
            };
        case 'UPDATE_STATS':
            return {
                ...state,
                stats: {
                    ...state.stats,
                    ...action.payload
                }
            };
        case 'UPDATE_SCORE':
            return {
                ...state,
                score: action.payload
            };

        case 'UPDATE_PATIENT_PROGRESS':
            if (state.activePatient) {
                return {
                    ...state,
                    activePatient: {
                        ...state.activePatient,
                        healingProgress: action.payload.progress
                    }
                };
            }
            return state;

        case 'UPDATE_OCEAN_SOLUTION':
            if (state.activePatient) {
                return {
                    ...state,
                    activePatient: {
                        ...state.activePatient,
                        oceanMetaphor: {
                            ...state.activePatient.oceanMetaphor,
                            solutions: state.activePatient.oceanMetaphor.solutions.map(solution =>
                                solution.id === action.payload.solutionId
                                    ? { ...solution, isCompleted: action.payload.isCompleted }
                                    : solution
                            )
                        }
                    }
                };
            }
            return state;
        default:
            return state;
    }
};

// Provider component
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};


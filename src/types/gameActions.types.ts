import {GameScene, Patient, GameStats, Position} from './game.types';

export interface PatientProgress {
    progress: number;
}

export interface OceanSolutionUpdate {
    solutionId: string;
    isCompleted: boolean;
}

export type GameAction =
    | { type: 'SET_SCENE'; payload: GameScene }
    | { type: 'SET_ACTIVE_PATIENT'; payload: Patient | null }
    | { type: 'SELECT_ACTIVE_PATIENT'; payload: Patient }
    | { type: 'SET_DREAM_STATE'; payload: boolean }
    | { type: 'SET_WAITING_PATIENTS'; payload: Patient[] }
    | { type: 'ADD_WAITING_PATIENT'; payload: Patient }
    | { type: 'SET_SCORE'; payload: number }
    | { type: 'UPDATE_SCORE'; payload: number }
    | { type: 'SET_PAUSED'; payload: boolean }
    | { type: 'SET_DREAM_WORLD_ACTIVE'; payload: boolean }
    | { type: 'MOVE_DOCTOR'; payload: Position }
    | { type: 'TOGGLE_DREAM_WORLD' }
    | { type: 'UPDATE_STATS'; payload: Partial<GameStats> }
    | { type: 'UPDATE_PATIENT_PROGRESS'; payload: PatientProgress }
    | { type: 'UPDATE_OCEAN_SOLUTION'; payload: OceanSolutionUpdate };
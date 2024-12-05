export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface GameObject {
    id: string;
    position: Position;
    size: Size;
    isInteractive: boolean;
}

export interface Character extends GameObject {
    name: string;
    state: CharacterState;
}

export interface Doctor extends Character {
    type: 'DOCTOR';
    dialogues: string[];
}

export interface Patient extends Character {
    type: 'PATIENT';
    condition: HealthCondition;
    dreamState: boolean;
    dreamPowers: DreamPower[];
    oceanMetaphor: OceanMetaphor;
    healingProgress: number;
}

export interface OceanMetaphor {
    type: OceanMetaphorType;
    severity: number;
    solutions: OceanSolution[];
    currentProgress: number;
}

export interface OceanSolution {
    id: string;
    type: SolutionType;
    isCompleted: boolean;
    description: string;
}

// Stats du jeu
export interface GameStats {
    patientsHealed: number;
    totalScore: number;
    timeElapsed: number;
    successRate: number;
}

export enum DreamPower {
    WATER_CONTROL = 'WATER_CONTROL',
    MARINE_COMMUNICATION = 'MARINE_COMMUNICATION',
    POLLUTION_CLEANING = 'POLLUTION_CLEANING',
    CORAL_RESTORATION = 'CORAL_RESTORATION',
    ICE_FORMATION = 'ICE_FORMATION'
}

export enum SolutionType {
    CLEAN_POLLUTION = 'CLEAN_POLLUTION',
    HEAL_CORAL = 'HEAL_CORAL',
    REMOVE_PLASTIC = 'REMOVE_PLASTIC',
    BALANCE_PH = 'BALANCE_PH',
    STABILIZE_TEMPERATURE = 'STABILIZE_TEMPERATURE'
}

export enum CharacterState {
    IDLE = 'IDLE',
    WALKING = 'WALKING',
    DREAMING = 'DREAMING',
    HEALING = 'HEALING',
    SWIMMING = 'SWIMMING',
    USING_POWER = 'USING_POWER'
}

export enum HealthCondition {
    HEALTHY = 'HEALTHY',
    INFECTED = 'INFECTED',
    HEALING = 'HEALING'
}

export enum OceanMetaphorType {
    POLLUTION = 'POLLUTION',           // Représente une infection
    CORAL_BLEACHING = 'CORAL_BLEACHING', // Représente une inflammation
    PLASTIC_WASTE = 'PLASTIC_WASTE',     // Représente des corps étrangers
    ACIDIFICATION = 'ACIDIFICATION',     // Représente un déséquilibre
    ICE_MELTING = 'ICE_MELTING'         // Représente une perte de tissu
}

export enum GameScene {
    MAIN_MENU = 'MAIN_MENU',
    CLINIC = 'CLINIC',
    DREAM_WORLD = 'DREAM_WORLD',
    ABOUT = 'ABOUT',
    TUTORIAL = 'TUTORIAL',
    CREDITS = 'CREDITS'
}

export interface GameState {
    currentScene: GameScene;
    activePatient: Patient | null;
    doctor: Doctor;
    waitingPatients: Patient[];
    score: number;
    isPaused: boolean;
    dreamWorldActive: boolean;
    stats: GameStats;
}
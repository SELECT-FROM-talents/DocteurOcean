// Types de base pour les positions et dimensions
export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Velocity {
    dx: number;
    dy: number;
}

// Types pour les éléments de jeu
export interface GameObject {
    id: string;
    position: Position;
    size: Size;
    isInteractive: boolean;
    zIndex?: number;
}

// Types pour les personnages
export interface Character extends GameObject {
    name: string;
    state: CharacterState;
    velocity?: Velocity;
    sprite?: string;
    animation?: AnimationState;
}

// Types spécifiques au docteur
export interface Doctor extends Character {
    type: 'DOCTOR';
    healingPower: number;
    specialAbilities?: DoctorAbility[];
    currentPatient?: string; // ID du patient en cours de traitement
}

// Types spécifiques aux patients
export interface Patient extends Character {
    type: 'PATIENT';
    condition: HealthCondition;
    dreamState: boolean;
    symptoms?: Symptom[];
    treatmentProgress?: number;
    oceanMetaphor?: OceanMetaphor;
}

// Types pour les métaphores océaniques
export interface OceanMetaphor {
    type: OceanMetaphorType;
    severity: number;
    affectedArea?: string;
}

// Énumérations
export enum CharacterState {
    IDLE = 'IDLE',
    WALKING = 'WALKING',
    HEALING = 'HEALING',
    DREAMING = 'DREAMING',
    TALKING = 'TALKING',
    TRANSITIONING = 'TRANSITIONING'
}

export enum HealthCondition {
    HEALTHY = 'HEALTHY',
    INFECTED = 'INFECTED',
    HEALING = 'HEALING',
    CRITICAL = 'CRITICAL'
}

export enum GameScene {
    MAIN_MENU = 'MAIN_MENU',
    CLINIC = 'CLINIC',
    DREAM_WORLD = 'DREAM_WORLD',
    PAUSE_MENU = 'PAUSE_MENU',
    TREATMENT_ROOM = 'TREATMENT_ROOM'
}

export enum DoctorAbility {
    DREAM_INDUCEMENT = 'DREAM_INDUCEMENT',
    OCEAN_HEALING = 'OCEAN_HEALING',
    CORAL_RESTORATION = 'CORAL_RESTORATION',
    WATER_PURIFICATION = 'WATER_PURIFICATION'
}

export enum OceanMetaphorType {
    POLLUTION = 'POLLUTION',           // Représente une infection
    CORAL_BLEACHING = 'CORAL_BLEACHING', // Représente une inflammation
    PLASTIC_WASTE = 'PLASTIC_WASTE',     // Représente des corps étrangers
    ACIDIFICATION = 'ACIDIFICATION',     // Représente un déséquilibre
    ICE_MELTING = 'ICE_MELTING'         // Représente une perte de tissu
}

export enum AnimationState {
    IDLE = 'IDLE',
    WALK_LEFT = 'WALK_LEFT',
    WALK_RIGHT = 'WALK_RIGHT',
    HEAL = 'HEAL',
    DREAM = 'DREAM'
}

export enum Symptom {
    FEVER = 'FEVER',
    PAIN = 'PAIN',
    INFLAMMATION = 'INFLAMMATION',
    FATIGUE = 'FATIGUE'
}

// État global du jeu
export interface GameState {
    currentScene: GameScene;
    doctor: Doctor;
    patients: Patient[];
    score: number;
    isPaused: boolean;
    dreamWorldActive: boolean;
    currentLevel?: number;
    difficulty?: GameDifficulty;
    stats: GameStats;
}

export interface GameStats {
    patientsHealed: number;
    totalScore: number;
    timeElapsed: number;
    successRate: number;
}

export enum GameDifficulty {
    EASY = 'EASY',
    NORMAL = 'NORMAL',
    HARD = 'HARD'
}

// Types pour les collisions et interactions
export interface Collision {
    object1: GameObject;
    object2: GameObject;
    type: CollisionType;
}

export enum CollisionType {
    NONE = 'NONE',
    OVERLAP = 'OVERLAP',
    CONTAINMENT = 'CONTAINMENT'
}
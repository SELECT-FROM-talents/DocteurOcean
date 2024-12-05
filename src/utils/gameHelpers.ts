import {
    Patient,
    Position,
    HealthCondition,
    CharacterState,
    OceanMetaphorType
} from '@/types/game.types';

const patientNames = [
    'Sophie', 'Lucas', 'Emma', 'Louis', 'Chloé',
    'Hugo', 'Alice', 'Jules', 'Léa', 'Thomas'
];

const getRandomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

export const generatePatient = (index: number): Patient => {
    // Position dans la salle d'attente
    const position: Position = {
        x: 50,
        y: 100 + (index * 80) // Espacés verticalement
    };

    // Sélection aléatoire des conditions
    const condition = getRandomElement([
        HealthCondition.INFECTED,
        HealthCondition.HEALING
    ]);

    // Association des métaphores océaniques aux conditions
    const oceanMetaphorType = getRandomElement([
        OceanMetaphorType.POLLUTION,
        OceanMetaphorType.CORAL_BLEACHING,
        OceanMetaphorType.PLASTIC_WASTE,
        OceanMetaphorType.ACIDIFICATION,
        OceanMetaphorType.ICE_MELTING
    ]);

    return {
        id: `patient-${Date.now()}-${index}`,
        type: 'PATIENT',
        name: getRandomElement(patientNames),
        position,
        size: { width: 48, height: 48 },
        state: CharacterState.IDLE,
        isInteractive: true,
        condition,
        dreamState: false,
        oceanMetaphor: {
            type: oceanMetaphorType,
            severity: Math.random() * 100
        }
    };
};
import {
    Patient,
    Position,
    HealthCondition,
    CharacterState,
    OceanMetaphorType,
    DreamPower,
    SolutionType
} from '@/types/game.types';
import {useGame} from "@/contexts/GameContext.tsx";

const patientNames = [
    'Sophie', 'Lucas', 'Emma', 'Louis', 'Chloé',
    'Hugo', 'Alice', 'Jules', 'Léa', 'Thomas'
] as const;

function getRandomElement<T>(array: readonly T[]): T {
    if (array.length === 0) {
        throw new Error("Cannot get random element from empty array");
    }
    // @ts-ignore
    return array[Math.floor(Math.random() * array.length)];
}

const getSolutionsForMetaphor = (metaphorType: OceanMetaphorType): SolutionType[] => {
    const solutionsMap: Record<OceanMetaphorType, SolutionType[]> = {
        [OceanMetaphorType.POLLUTION]: [SolutionType.CLEAN_POLLUTION, SolutionType.BALANCE_PH],
        [OceanMetaphorType.CORAL_BLEACHING]: [SolutionType.HEAL_CORAL, SolutionType.STABILIZE_TEMPERATURE],
        [OceanMetaphorType.PLASTIC_WASTE]: [SolutionType.REMOVE_PLASTIC, SolutionType.CLEAN_POLLUTION],
        [OceanMetaphorType.ACIDIFICATION]: [SolutionType.BALANCE_PH, SolutionType.HEAL_CORAL],
        [OceanMetaphorType.ICE_MELTING]: [SolutionType.STABILIZE_TEMPERATURE]
    };

    return solutionsMap[metaphorType] || [SolutionType.CLEAN_POLLUTION];
};

const getPowersForMetaphor = (metaphorType: OceanMetaphorType): DreamPower[] => {
    const powersMap: Record<OceanMetaphorType, DreamPower[]> = {
        [OceanMetaphorType.POLLUTION]: [DreamPower.POLLUTION_CLEANING, DreamPower.WATER_CONTROL],
        [OceanMetaphorType.CORAL_BLEACHING]: [DreamPower.CORAL_RESTORATION, DreamPower.MARINE_COMMUNICATION],
        [OceanMetaphorType.PLASTIC_WASTE]: [DreamPower.POLLUTION_CLEANING, DreamPower.MARINE_COMMUNICATION],
        [OceanMetaphorType.ACIDIFICATION]: [DreamPower.WATER_CONTROL, DreamPower.CORAL_RESTORATION],
        [OceanMetaphorType.ICE_MELTING]: [DreamPower.ICE_FORMATION, DreamPower.WATER_CONTROL]
    };

    return powersMap[metaphorType] || [DreamPower.WATER_CONTROL];
};

export const generatePatient = (index: number): Patient => {
    const position: Position = {
        x: 50,
        y: 100 + (index * 80)
    };

    const conditions = [HealthCondition.INFECTED, HealthCondition.HEALING] as const;
    const condition = getRandomElement(conditions);

    const metaphorTypes = Object.values(OceanMetaphorType);
    const metaphorType = getRandomElement(metaphorTypes);

    const dreamPowers = getPowersForMetaphor(metaphorType);
    const solutionTypes = getSolutionsForMetaphor(metaphorType);

    const solutions = solutionTypes.map((type, i) => ({
        id: `solution-${Date.now()}-${i}`,
        type,
        isCompleted: false,
        description: getDescriptionForSolution(type)
    }));

    return {
        id: `patient-${Date.now()}-${index}`,
        type: 'PATIENT' as const,
        name: getRandomElement([...patientNames]),
        position,
        size: { width: 48, height: 48 },
        state: CharacterState.IDLE,
        isInteractive: true,
        condition,
        dreamState: false,
        healingProgress: 0,
        dreamPowers,
        oceanMetaphor: {
            type: metaphorType,
            severity: Math.floor(Math.random() * 60) + 40,
            solutions,
            currentProgress: 0
        }
    };
};

const getDescriptionForSolution = (type: SolutionType): string => {
    const descriptions: Record<SolutionType, string> = {
        [SolutionType.CLEAN_POLLUTION]: "Nettoyer les eaux troubles",
        [SolutionType.HEAL_CORAL]: "Restaurer les récifs endommagés",
        [SolutionType.REMOVE_PLASTIC]: "Éliminer les déchets étrangers",
        [SolutionType.BALANCE_PH]: "Rétablir l'équilibre des eaux",
        [SolutionType.STABILIZE_TEMPERATURE]: "Stabiliser la température"
    };

    return descriptions[type] || "Solution à trouver";
};

export const setDreamState = (dreamState: boolean) => {
    const { dispatch } = useGame();
    dispatch({ type: 'SET_DREAM_STATE', payload: dreamState });
};
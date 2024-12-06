import {
    Patient,
    Position,
    HealthCondition,
    CharacterState,
    OceanMetaphorType,
    DreamPower,
    SolutionType
} from '@/types/game.types';
import {Dispatch} from "react";
import {GameAction} from "@/types/gameActions.types.ts";

const getSolutionsForMetaphor = (metaphorType: OceanMetaphorType): SolutionType[] => {
    const solutionsMap: Record<OceanMetaphorType, SolutionType[]> = {
        [OceanMetaphorType.POLLUTION]: [SolutionType.CLEAN_POLLUTION, SolutionType.BALANCE_PH],
        [OceanMetaphorType.CORAL_BLEACHING]: [SolutionType.HEAL_CORAL, SolutionType.STABILIZE_TEMPERATURE],
        [OceanMetaphorType.PLASTIC_WASTE]: [SolutionType.REMOVE_PLASTIC, SolutionType.CLEAN_POLLUTION],
        [OceanMetaphorType.ACIDIFICATION]: [SolutionType.BALANCE_PH, SolutionType.HEAL_CORAL],
        [OceanMetaphorType.ICE_MELTING]: [SolutionType.STABILIZE_TEMPERATURE],
        [OceanMetaphorType.CREDITS]: []  // Ajout pour les crédits
    };

    return solutionsMap[metaphorType] || [SolutionType.CLEAN_POLLUTION];
};

const getPowersForMetaphor = (metaphorType: OceanMetaphorType): DreamPower[] => {
    const powersMap: Record<OceanMetaphorType, DreamPower[]> = {
        [OceanMetaphorType.POLLUTION]: [DreamPower.POLLUTION_CLEANING, DreamPower.WATER_CONTROL],
        [OceanMetaphorType.CORAL_BLEACHING]: [DreamPower.CORAL_RESTORATION, DreamPower.MARINE_COMMUNICATION],
        [OceanMetaphorType.PLASTIC_WASTE]: [DreamPower.POLLUTION_CLEANING, DreamPower.MARINE_COMMUNICATION],
        [OceanMetaphorType.ACIDIFICATION]: [DreamPower.WATER_CONTROL, DreamPower.CORAL_RESTORATION],
        [OceanMetaphorType.ICE_MELTING]: [DreamPower.ICE_FORMATION, DreamPower.WATER_CONTROL],
        [OceanMetaphorType.CREDITS]: [DreamPower.WATER_CONTROL]  // Ajout pour les crédits
    };

    return powersMap[metaphorType] || [DreamPower.WATER_CONTROL];
};

export const generatePatient = (index: number): Patient => {
    // Attribuer un type spécifique basé sur l'index
    const metaphorType = (() => {
        switch (index) {
            case 0:
                return OceanMetaphorType.POLLUTION;
            case 1:
                return OceanMetaphorType.CORAL_BLEACHING;
            case 2:
                return OceanMetaphorType.PLASTIC_WASTE;
            case 3:
                return OceanMetaphorType.ACIDIFICATION;
            case 4:
                return OceanMetaphorType.ICE_MELTING;
            default:
                return OceanMetaphorType.POLLUTION;
        }
    })();

    const position: Position = {
        x: 50,
        y: 100 + (index * 80)
    };

    // Conditions de santé correspondantes
    const condition = index === 4 ? HealthCondition.HEALING : HealthCondition.INFECTED;

    const dreamPowers = getPowersForMetaphor(metaphorType);
    const solutionTypes = getSolutionsForMetaphor(metaphorType);

    const solutions = solutionTypes.map((type, i) => ({
        id: `solution-${Date.now()}-${i}`,
        type,
        isCompleted: false,
        description: getDescriptionForSolution(type)
    }));

    // Noms spécifiques pour chaque type de patient
    const patientName = (() => {
        switch (metaphorType) {
            case OceanMetaphorType.POLLUTION:
                return 'Sophie';
            case OceanMetaphorType.CORAL_BLEACHING:
                return 'Lucas';
            case OceanMetaphorType.PLASTIC_WASTE:
                return 'Emma';
            case OceanMetaphorType.ACIDIFICATION:
                return 'Louis';
            case OceanMetaphorType.ICE_MELTING:
                return 'Chloé';
            default:
                return 'Patient';
        }
    })();

    return {
        id: `patient-${Date.now()}-${index}`,
        type: 'PATIENT' as const,
        name: patientName,
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

export const setDreamState = (
    dispatch: Dispatch<GameAction>,
    state: boolean
) => {
    dispatch({ type: 'SET_DREAM_STATE', payload: state });
};
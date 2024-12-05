import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';

interface WasteItem {
    id: string;
    x: number;
    y: number;
    type: 'bottle' | 'bag' | 'container';
    collected: boolean;
    rotation: number;
}

interface PlasticWasteGameProps {
    onGameEnd: (score: number) => void;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const WASTE_SIZE = 40;
const INITIAL_SPAWN_INTERVAL = 1500;
const MIN_SPAWN_INTERVAL = 200;
const FINAL_SPAWN_INTERVAL = 100;
const DIFFICULTY_INCREASE_INTERVAL = 3000;

const getRandomPosition = () => {
    const gridCellSize = WASTE_SIZE * 2;
    const maxGridX = Math.floor((GAME_WIDTH - WASTE_SIZE) / gridCellSize);
    const maxGridY = Math.floor((GAME_HEIGHT - WASTE_SIZE) / gridCellSize);

    const gridX = Math.floor(Math.random() * maxGridX);
    const gridY = Math.floor(Math.random() * maxGridY);

    const offsetX = Math.random() * WASTE_SIZE;
    const offsetY = Math.random() * WASTE_SIZE;

    return {
        x: gridX * gridCellSize + offsetX,
        y: gridY * gridCellSize + offsetY,
        rotation: Math.random() * 360
    };
};

const WASTE_TYPES = ['bottle', 'bag', 'container'] as const;

const PlasticWasteGame: React.FC<PlasticWasteGameProps> = ({ onGameEnd }) => {
    const { dispatch } = useGame();
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
    const [difficulty, setDifficulty] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [shouldEndGame, setShouldEndGame] = useState(false);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

    const scoreRef = useRef(0);
    const timerRef = useRef<number | null>(null);
    const spawnTimerRef = useRef<number | null>(null);
    const difficultyTimerRef = useRef<number | null>(null);
    const isMounted = useRef(true);
    const gameAreaRef = useRef<HTMLDivElement>(null);

    const createWasteItem = useCallback((): WasteItem => {
        const { x, y, rotation } = getRandomPosition();
        return {
            id: `waste-${Date.now()}-${Math.random()}`,
            x,
            y,
            rotation,
            type: WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)],
            collected: false
        };
    }, []);

    const getSpawnInterval = useCallback((currentDifficulty: number, currentTimeLeft: number) => {
        if (currentTimeLeft <= 5) {
            return FINAL_SPAWN_INTERVAL;
        }
        const normalInterval = INITIAL_SPAWN_INTERVAL - (currentDifficulty * 200);
        return Math.max(normalInterval, MIN_SPAWN_INTERVAL);
    }, []);

    const getMaxWaste = useCallback((currentTimeLeft: number) => {
        if (currentTimeLeft <= 5) {
            return 30;
        }
        return Math.min(8 + Math.floor(difficulty * 2), 20);
    }, [difficulty]);

    const resetSpawnTimer = useCallback((currentDifficulty: number, currentTimeLeft: number) => {
        if (spawnTimerRef.current) {
            clearInterval(spawnTimerRef.current);
        }

        const spawnInterval = getSpawnInterval(currentDifficulty, currentTimeLeft);

        spawnTimerRef.current = window.setInterval(() => {
            if (isMounted.current) {
                setWasteItems(prev => {
                    const activeItems = prev.filter(item => !item.collected);
                    const maxWaste = getMaxWaste(currentTimeLeft);
                    if (activeItems.length < maxWaste) {
                        if (currentTimeLeft <= 5) {
                            return [...prev, createWasteItem(), createWasteItem()];
                        }
                        return [...prev, createWasteItem()];
                    }
                    return prev;
                });
            }
        }, spawnInterval);
    }, [createWasteItem, getMaxWaste, getSpawnInterval]);

    useEffect(() => {
        if (shouldEndGame && !gameOver) {
            dispatch({ type: 'UPDATE_SCORE', payload: scoreRef.current });
            dispatch({
                type: 'UPDATE_PATIENT_PROGRESS',
                payload: { progress: Math.min(100, scoreRef.current) }
            });

            if (scoreRef.current >= 20) {
                dispatch({
                    type: 'UPDATE_OCEAN_SOLUTION',
                    payload: {
                        solutionId: 'REMOVE_PLASTIC',
                        isCompleted: true
                    }
                });
            }

            setTimeout(() => {
                setGameOver(true);
            }, 2000);
        }
    }, [shouldEndGame, gameOver, dispatch]);

    useEffect(() => {
        const initialWaste = Array.from({ length: 5 }, createWasteItem);
        setWasteItems(initialWaste);
        setDifficulty(1);

        isMounted.current = true;

        timerRef.current = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
                    if (difficultyTimerRef.current) clearInterval(difficultyTimerRef.current);
                    setShouldEndGame(true);
                    return 0;
                }

                if (prev === 6) {
                    resetSpawnTimer(difficulty, 5);
                }

                return prev - 1;
            });
        }, 1000);

        difficultyTimerRef.current = window.setInterval(() => {
            if (isMounted.current) {
                setDifficulty(prev => {
                    const newDifficulty = prev + 1;
                    resetSpawnTimer(newDifficulty, timeLeft);
                    return newDifficulty;
                });
            }
        }, DIFFICULTY_INCREASE_INTERVAL);

        resetSpawnTimer(1, 30);

        return () => {
            isMounted.current = false;
            if (timerRef.current) clearInterval(timerRef.current);
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
            if (difficultyTimerRef.current) clearInterval(difficultyTimerRef.current);
        };
    }, [createWasteItem, difficulty, resetSpawnTimer, timeLeft]);

    const handleCollectWaste = useCallback((wasteId: string) => {
        if (timeLeft > 0) {
            setWasteItems(prev =>
                prev.map(item =>
                    item.id === wasteId ? { ...item, collected: true } : item
                )
            );
            setScore(prev => {
                const newScore = prev + 1;
                scoreRef.current = newScore;
                return newScore;
            });
        }
    }, [timeLeft]);

    const getWasteEmoji = (type: WasteItem['type']) => {
        switch (type) {
            case 'bottle': return '🍾';
            case 'bag': return '🛍️';
            case 'container': return '📦';
            default: return '🗑️';
        }
    };

    const endDialogue = {
        doctor: [
            `Je vois que vous avez réussi à collecter ${score} déchets. C'est un excellent indicateur de votre engagement.`,
            score >= 20
                ? "La transformation est remarquable. Votre océan intérieur retrouve sa clarté, tout comme votre santé s'améliore."
                : "C'est un bon début. La guérison, comme la préservation des océans, est un processus qui demande du temps.",
            "Chaque déchet que vous avez collecté représente un pas vers la guérison, mais aussi un geste pour nos océans réels.",
            "Cette expérience nous montre que la santé des océans et la nôtre sont intimement liées."
        ],
        patient: [
            `Je me sens différent après avoir collecté tous ces déchets...`,
            score >= 20
                ? "C'est incroyable comme je me sens plus léger, plus sain."
                : "Je comprends qu'il me faudra plus d'efforts pour retrouver un équilibre parfait.",
            "Je réalise maintenant l'impact que peuvent avoir nos actions sur les océans.",
            "Merci, Docteur. Je veillerai désormais à protéger les océans comme je protège ma santé."
        ]
    };

    const handleNextDialogue = () => {
        const totalDialogues = endDialogue.doctor.length + endDialogue.patient.length;
        if (currentDialogueIndex < totalDialogues - 1) {
            setCurrentDialogueIndex(prev => prev + 1);
        } else {
            onGameEnd(scoreRef.current);
            dispatch({ type: 'TOGGLE_DREAM_WORLD' });
        }
    };

    if (gameOver) {
        const totalDialogues = endDialogue.doctor.length + endDialogue.patient.length;
        const isDoctorSpeaking = currentDialogueIndex % 2 === 0;
        const speakerIndex = Math.floor(currentDialogueIndex / 2);
        const dialogueText = isDoctorSpeaking
            ? endDialogue.doctor[speakerIndex]
            : endDialogue.patient[speakerIndex];

        return (
            <div className="plastic-waste-game" style={{ position: 'relative' }}>
                <div className="game-over" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        marginBottom: '1rem',
                        padding: '1rem',
                        backgroundColor: isDoctorSpeaking ? '#e3f2fd' : '#f5f5f5',
                        borderRadius: '8px',
                        width: '100%'
                    }}>
                        <p style={{
                            fontWeight: 'bold',
                            marginBottom: '0.5rem',
                            color: isDoctorSpeaking ? '#1976d2' : '#616161'
                        }}>
                            {isDoctorSpeaking ? 'Dr. Océan:' : 'Patient:'}
                        </p>
                        <p>{dialogueText}</p>
                    </div>
                    <button
                        onClick={handleNextDialogue}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {currentDialogueIndex < totalDialogues - 1 ? 'Suivant' : 'Retour à la clinique'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="plastic-waste-game" style={{ position: 'relative' }}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Collect the Plastic Waste!</h3>
                <div className="flex gap-4">
                    <p className="text-lg" style={{
                        color: timeLeft <= 5 ? 'red' : 'inherit',
                        fontWeight: timeLeft <= 5 ? 'bold' : 'normal'
                    }}>
                        ⏱️ {timeLeft}s
                    </p>
                    <p className="text-lg">🏆 {score}</p>
                    <p className="text-lg">📈 Level {difficulty}</p>
                </div>
            </div>

            <div
                ref={gameAreaRef}
                style={{
                    position: 'relative',
                    width: `${GAME_WIDTH}px`,
                    height: `${GAME_HEIGHT}px`,
                    backgroundColor: timeLeft <= 5 ? '#fef2f2' : '#dbeafe',
                    border: `4px solid ${timeLeft <= 5 ? '#fca5a5' : '#93C5FD'}`,
                    borderRadius: '8px',
                    margin: '0 auto',
                    overflow: 'hidden',
                    transition: 'background-color 0.3s, border-color 0.3s'
                }}
            >
                {wasteItems.map(waste => !waste.collected && (
                    <div
                        key={waste.id}
                        style={{
                            position: 'absolute',
                            left: `${waste.x}px`,
                            top: `${waste.y}px`,
                            width: `${WASTE_SIZE}px`,
                            height: `${WASTE_SIZE}px`,
                            transform: `rotate(${waste.rotation}deg)`,
                            fontSize: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                            zIndex: '1'
                        }}
                        onClick={() => handleCollectWaste(waste.id)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = `rotate(${waste.rotation}deg) scale(1.2)`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = `rotate(${waste.rotation}deg) scale(1)`;
                        }}
                    >
                        {getWasteEmoji(waste.type)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlasticWasteGame;
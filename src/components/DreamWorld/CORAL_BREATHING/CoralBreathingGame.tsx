import {useCallback, useEffect, useState} from "react";
import { useGame } from '@/contexts/GameContext';

interface FeedbackType {
    text: string;
    color: string;
}

interface Zones {
    perfect: {start: number, end: number};
    good: {start: number, end: number};
}

const INITIAL_GAME_TIME = 30;
const SUCCESS_THRESHOLD = 80;
const INITIAL_SPEED = 30; // Encore plus rapide
const MAX_SPEED = 15; // Vitesse maximale encore plus élevée
const ZONE_CHANGE_INTERVAL = 10000; // 10 secondes

const CoralBreathingGame = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [breathProgress, setBreathProgress] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(INITIAL_GAME_TIME);
    const [showGameOver, setShowGameOver] = useState(false);
    const [coralHealth, setCoralHealth] = useState(Array(5).fill(100));
    const [feedback, setFeedback] = useState<FeedbackType | null>(null);
    const [oxygenLevel, setOxygenLevel] = useState(50);
    const [currentSpeed, setCurrentSpeed] = useState(INITIAL_SPEED);
    const [zones, setZones] = useState<Zones>({
        perfect: { start: 45, end: 55 },
        good: { start: 35, end: 65 }
    });

    // gestion GameOver
    const [gameOver, setGameOver] = useState(false);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const { dispatch } = useGame();


    // Fonction pour générer de nouvelles positions de zones
    const generateNewZones = useCallback(() => {
        // Position aléatoire pour la zone parfaite (largeur de 10)
        const perfectStart = Math.floor(Math.random() * 80) + 5; // Entre 5 et 85
        const perfectEnd = perfectStart + 10;

        // La zone "bonne" entoure la zone parfaite
        const goodStart = Math.max(0, perfectStart - 10);
        const goodEnd = Math.min(100, perfectEnd + 10);

        return {
            perfect: { start: perfectStart, end: perfectEnd },
            good: { start: goodStart, end: goodEnd }
        };
    }, []);

    // Changement de zones toutes les 10 secondes
    useEffect(() => {
        if (!isPlaying) return;

        const zoneInterval = setInterval(() => {
            setZones(generateNewZones());
        }, ZONE_CHANGE_INTERVAL);

        return () => clearInterval(zoneInterval);
    }, [isPlaying, generateNewZones]);

    // Gestion de la vitesse
    useEffect(() => {
        if (!isPlaying) return;

        const speedFactor = (INITIAL_GAME_TIME - timeLeft) / INITIAL_GAME_TIME;
        const newSpeed = Math.max(MAX_SPEED, INITIAL_SPEED - (speedFactor * 20));
        setCurrentSpeed(newSpeed);
    }, [timeLeft, isPlaying]);

    // Animation de la barre de respiration
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setBreathProgress(prev => (prev >= 100 ? 0 : prev + 1));
        }, currentSpeed);

        return () => clearInterval(interval);
    }, [isPlaying, currentSpeed]);

    // Timer du jeu
    useEffect(() => {
        if (!isPlaying) return;

        const gameInterval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsPlaying(false);
                    setGameOver(true);

                    dispatch({ type: 'UPDATE_SCORE', payload: score });
                    dispatch({
                        type: 'UPDATE_PATIENT_PROGRESS',
                        payload: { progress: Math.min(100, calculateFinalScore(score)) }
                    });

                    if (calculateFinalScore(score) >= SUCCESS_THRESHOLD) {
                        dispatch({
                            type: 'UPDATE_OCEAN_SOLUTION',
                            payload: {
                                solutionId: 'CORAL_BREATHING',
                                isCompleted: true
                            }
                        });
                    }

                    return 0;
                }
                return prev - 1;
            });

            setOxygenLevel(prev => Math.max(0, prev - 0.5));
        }, 1000);

        return () => clearInterval(gameInterval);
    }, [isPlaying, score, dispatch]);

    const handleBreath = useCallback(() => {
        if (!isPlaying) return;

        let points = 0;
        let feedbackText = '';
        let feedbackColor = '';

        if (breathProgress >= zones.perfect.start && breathProgress <= zones.perfect.end) {
            points = 10;
            feedbackText = "Parfait ! 🌟";
            feedbackColor = "#22c55e";
        } else if (breathProgress >= zones.good.start && breathProgress <= zones.good.end) {
            points = 5;
            feedbackText = "Bien ! ✨";
            feedbackColor = "#3b82f6";
        } else {
            feedbackText = "Raté... 💨";
            feedbackColor = "#ef4444";
        }

        setScore(prev => prev + points);
        setOxygenLevel(prev => Math.min(100, prev + points));
        setFeedback({ text: feedbackText, color: feedbackColor });
        setTimeout(() => setFeedback(null), 1000);
        setCoralHealth(prev => prev.map(health => Math.min(100, health + points/2)));
    }, [isPlaying, breathProgress, zones]);

    const calculateFinalScore = (points: number) => {
        const maxPossibleScore = (INITIAL_GAME_TIME / 4) * 10;
        return Math.min(100, Math.round((points / maxPossibleScore) * 100));
    };

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setTimeLeft(INITIAL_GAME_TIME);
        setCoralHealth(Array(5).fill(100));
        setOxygenLevel(50);
        setShowGameOver(false);
        setBreathProgress(0);
        setCurrentSpeed(INITIAL_SPEED);
        setZones(generateNewZones());
    };

    const getBarColor = (progress: number) => {
        if (progress >= zones.perfect.start && progress <= zones.perfect.end) return '#22c55e';
        if (progress >= zones.good.start && progress <= zones.good.end) return '#3b82f6';
        return '#ef4444';
    };

    const endDialogue = {
        doctor: [
            `Votre score final de ${calculateFinalScore(score)}% montre à quel point vous avez réussi à synchroniser votre respiration avec le rythme des coraux.`,
            calculateFinalScore(score) >= SUCCESS_THRESHOLD
                ? "C'est un excellent résultat. Saviez-vous que la respiration profonde et lente, comme celle des coraux, peut réduire le stress et améliorer la fonction cardiovasculaire ?"
                : "C'est un début prometteur. Tout comme les coraux dépendent d'une eau propre et riche en oxygène, notre santé dépend d'une respiration saine.",
            "En fait, la Grande Barrière de Corail, qui abrite une incroyable diversité de vie marine, a perdu plus de la moitié de ses coraux depuis 1995 en raison du stress environnemental.",
            "Mais il y a de l'espoir. En prenant soin de notre respiration et en réduisant notre impact sur l'environnement, nous pouvons favoriser notre bien-être et celui des écosystèmes marins."
        ],
        patient: [
            "Je ne réalisais pas à quel point notre respiration et la santé des coraux étaient liées...",
            calculateFinalScore(score) >= SUCCESS_THRESHOLD
                ? "C'est fascinant de penser que nous pouvons tirer des leçons de la respiration des coraux pour améliorer notre propre santé."
                : "Il est clair que nous devons être plus attentifs à notre respiration et à l'impact de nos actions sur l'environnement marin.",
            "C'est alarmant d'apprendre que la Grande Barrière de Corail a déjà perdu plus de la moitié de ses coraux. Nous devons agir maintenant.",
            "Vous avez raison, Docteur. En prenant soin de nous-mêmes et de notre environnement, nous pouvons créer un avenir plus sain pour tous, des récifs coralliens aux êtres humains."
        ]
    };

    const handleNextDialogue = () => {
        const totalDialogues = endDialogue.doctor.length + endDialogue.patient.length;
        if (currentDialogueIndex < totalDialogues - 1) {
            setCurrentDialogueIndex(prev => prev + 1);
        } else {
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
            <div className="coral-breathing-game">
                <div className="game-over">
                    <div className="dialogue-box">
                        <div
                            style={{
                                backgroundColor: isDoctorSpeaking ? '#e3f2fd' : '#f5f5f5',
                                padding: '1.5rem',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}
                        >
                            <p className="speaker">
                                {isDoctorSpeaking ? 'Dr. Océan:' : 'Patient:'}
                            </p>
                            <p className="text">
                                {dialogueText}
                            </p>
                        </div>
                        <button
                            className="next-button"
                            onClick={handleNextDialogue}
                        >
                            {currentDialogueIndex < totalDialogues - 1 ? 'Suivant' : 'Retour à la clinique'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#0ea5e9' }}>
                Respiration des Coraux
            </h2>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <div>⏱️ {timeLeft}s</div>
                <div>💨 Score: {score}</div>
                <div>🌊 O₂: {Math.round(oxygenLevel)}%</div>
            </div>

            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '600px',
                height: '400px',
                margin: '0 auto',
                backgroundColor: '#e0f7fa',
                border: '2px solid #93C5FD',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '200px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        left: `${zones.perfect.start}%`,
                        width: `${zones.perfect.end - zones.perfect.start}%`,
                        height: '100%',
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        zIndex: 1,
                        transition: 'all 0.3s ease'
                    }} />
                    <div style={{
                        position: 'absolute',
                        left: `${zones.good.start}%`,
                        width: `${zones.good.end - zones.good.start}%`,
                        height: '100%',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        zIndex: 1,
                        transition: 'all 0.3s ease'
                    }} />
                    <div style={{
                        height: '100%',
                        width: `${breathProgress}%`,
                        backgroundColor: getBarColor(breathProgress),
                        transition: `width ${currentSpeed}ms linear`,
                        zIndex: 2
                    }} />
                </div>

                {feedback && (
                    <div style={{
                        position: 'absolute',
                        top: '60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '24px',
                        color: feedback.color
                    }}>
                        {feedback.text}
                    </div>
                )}

                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '0',
                    right: '0',
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    {coralHealth.map((health, index) => (
                        <div
                            key={index}
                            style={{
                                opacity: health/100,
                                fontSize: '48px',
                                transform: `scale(${1 + (health-50)/200})`,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            🪸
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleBreath}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <p style={{ color: '#0284c7' }}>
                    Cliquez lorsque la barre bleue est dans la zone verte (meilleur timing) ou bleue (bon timing)
                    <br />
                    <small>Les zones changent toutes les 10 secondes !</small>
                </p>

                {!isPlaying && !showGameOver && (
                    <button
                        onClick={startGame}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: '#60A5FA',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Commencer
                    </button>
                )}
            </div>

            {showGameOver && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        textAlign: 'center'
                    }}>
                        <h2>{calculateFinalScore(score) >= SUCCESS_THRESHOLD ? "Félicitations ! 🎉" : "Partie terminée"}</h2>
                        <p>{calculateFinalScore(score) >= SUCCESS_THRESHOLD
                            ? "Vous avez réussi à restaurer l'harmonie entre vos poumons et les coraux !"
                            : "Continuez à vous entraîner pour mieux synchroniser votre respiration."}
                        </p>
                        <p>Score final : {calculateFinalScore(score)}%</p>
                        <button
                            onClick={startGame}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#60A5FA',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Rejouer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoralBreathingGame;
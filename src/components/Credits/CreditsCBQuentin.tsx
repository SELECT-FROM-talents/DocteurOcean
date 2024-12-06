import React, { useEffect, useState } from "react";

const CoralBreathingGame: React.FC<{ onGameEnd: () => void }> = ({ onGameEnd }) => {
    const [feedbacks, setFeedbacks] = useState<string[]>([]);
    const [letters, setLetters] = useState<string[]>([]);
    const [timer, setTimer] = useState<number | null>(null); // Timer non affiché
    const fullName = "QUENTIN GRELIER";

    // Gère l'apparition des étoiles "Parfait !" et dévoile une lettre à chaque apparition
    useEffect(() => {
        const interval = setInterval(() => {
            if (letters.length < fullName.length) {
                setFeedbacks((prev) => [...prev, "Parfait ! 🌟"]);
                // @ts-ignore
                setLetters((prev) => [...prev, fullName[prev.length]]);
            } else if (letters.length === fullName.length) {
                // Démarrer le timer une fois que toutes les lettres sont affichées
                if (timer === null) {
                    setTimer(5); // Timer initialisé à 5 secondes
                }
            }

            // Supprime le "Parfait !" après 500 ms
            setTimeout(() => {
                setFeedbacks((prev) => prev.slice(1));
            }, 250);
        }, 500);

        return () => clearInterval(interval);
    }, [letters, fullName, timer]);

    // Gère la décrémentation du timer et déclenche une action à 0
    useEffect(() => {
        if (timer !== null && timer > 0) {
            const timerInterval = setInterval(() => {
                setTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
            }, 250);

            return () => clearInterval(timerInterval);
        } else if (timer === 0) {
            // Action à effectuer lorsque le timer atteint 0
            onGameEnd();
        }
    }, [timer]);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#0ea5e9" }}>
                Respiration des Coraux
            </h2>

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "600px",
                    height: "400px",
                    margin: "0 auto",
                    backgroundColor: "#e0f7fa",
                    border: "2px solid #93C5FD",
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
            >
                {/* Jauge agrandie avec le texte progressif */}
                <div
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "300px",
                        height: "40px",
                        backgroundColor: "white",
                        borderRadius: "20px",
                        border: "2px solid #93C5FD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        color: "#0284c7",
                    }}
                >
                    {letters.map((letter, index) => (
                        <span key={index} style={{ marginRight: letter === " " ? "8px" : "0" }}>
                            {letter}
                        </span>
                    ))}
                </div>

                {/* Affichage des étoiles "Parfait !" */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        fontSize: "24px",
                        color: "#22c55e",
                    }}
                >
                    {feedbacks.map((feedback, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            {feedback}
                        </div>
                    ))}
                </div>

                {/* Coraux */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "0",
                        right: "0",
                        display: "flex",
                        justifyContent: "space-around",
                    }}
                >
                    {Array(5)
                        .fill("🪸")
                        .map((coral, index) => (
                            <div
                                key={index}
                                style={{
                                    fontSize: "48px",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {coral}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default CoralBreathingGame;

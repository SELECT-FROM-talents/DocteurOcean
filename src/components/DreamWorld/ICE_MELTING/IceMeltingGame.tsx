import React, { useState, useEffect, useRef } from "react";
import "./IceMeltingGame.css";

const ROWS = 11;
const COLS = 11;

const IceMeltingGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [grid, setGrid] = useState<string[][]>([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const centerRow = Math.floor(ROWS / 2);
        const centerCol = Math.floor(COLS / 2);
        const maxDistance = Math.min(ROWS, COLS) / 2 - 1;

        const initialGrid = Array.from({ length: ROWS }, (_, rowIndex) =>
            Array.from({ length: COLS }, (_, colIndex) => {
                const distance = Math.abs(rowIndex - centerRow) + Math.abs(colIndex - centerCol);
                return distance <= maxDistance ? "white" : "blue";
            })
        );
        setGrid(initialGrid);
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            endGame();
        } else {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            clearInterval(timerRef.current!);
        };
    }, [timeLeft]);

    useEffect(() => {
        const interval = setInterval(() => {
            setGrid((prevGrid) =>
                prevGrid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        if (cell.startsWith("white-red-")) {
                            const level = parseInt(cell.split("-")[2] || "0");
                            if (level >= 10) return "blue";
                            return `white-red-${level + 1}`;
                        }
                        if (cell === "white" && hasAdjacentBlue(prevGrid, rowIndex, colIndex)) {
                            return "white-red-1";
                        }
                        return cell;
                    })
                )
            );
        }, 750);
        return () => clearInterval(interval);
    }, []);

    const hasAdjacentBlue = (grid: string[][], row: number, col: number): boolean => {
        const directions: [number, number][] = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ];
        return directions.some(([dx, dy]) => {
            if (dx === undefined || dy === undefined) return false;

            const newRow = row + dx;
            const newCol = col + dy;

            if (newRow < 0 || newRow >= grid.length) return false;
            if (newCol < 0 || newCol >= (grid[0]?.length || 0)) return false;

            return grid[newRow]?.[newCol] === "blue";
        });
    };

    const handleClick = (row: number, col: number) => {
        setGrid((prevGrid) =>
            prevGrid.map((rowCells, rowIndex) =>
                rowCells.map((cell, colIndex) => {
                    if (rowIndex === row && colIndex === col && cell.startsWith("white-red-")) {
                        const level = parseInt(cell.split("-")[2] || "0");
                        return level > 10 ? `white-red-${level - 10}` : "white";
                    }
                    return cell;
                })
            )
        );
    };

    const getCellColor = (cell: string): string => {
        if (cell === "blue") return "#0000FF";
        if (cell === "white") return "#FFFFFF";
        if (cell.startsWith("white-red-")) {
            const level = parseInt(cell.split("-")[2] || "0");
            if (isNaN(level)) return "#000000";
            const red = Math.min(255, level * 25);
            return `rgb(${red}, ${255 - red}, 255)`;
        }
        return "#000000";
    };

    const endGame = () => {
        const remainingWhites = grid.flat().filter((cell) => cell.startsWith("white")).length;
        const finalScore = remainingWhites * 2;

        if (remainingWhites === 0 || finalScore < 20) {
            setGameOver(true);
        } else {
            setScore(finalScore);
            setGameOver(true);
        }
    };

    const endDialogue = {
        doctor: [
            `Vous avez terminé avec un score de ${score}.`,
            score >= 20
                ? "Votre performance est excellente, vous avez restauré une grande partie de votre océan intérieur."
                : "Votre océan reste partiellement détruit, mais vous pouvez continuer à améliorer votre santé.",
            "N'oubliez pas que chaque action compte pour préserver nos océans et notre santé."
        ],
        patient: [
            "Je vois à quel point cet exercice est difficile...",
            score >= 20
                ? "Je ressens déjà une amélioration, merci pour cet exercice."
                : "Je comprends que je dois redoubler d'efforts pour me rétablir.",
        ]
    };

    const handleNextDialogue = () => {
        const totalDialogues = endDialogue.doctor.length + endDialogue.patient.length;
        if (currentDialogueIndex < totalDialogues - 1) {
            setCurrentDialogueIndex((prev) => prev + 1);
        } else {
            onGameEnd(score);
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
            <div className="game-over">
                <div className="dialogue">
                    <p>
                        <strong>{isDoctorSpeaking ? "Dr. Océan" : "Patient"}:</strong> {dialogueText}
                    </p>
                    <button onClick={handleNextDialogue}>
                        {currentDialogueIndex < totalDialogues - 1 ? "Suivant" : "Retour"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="game">
            <div className="header">
                <p>Temps restant : {timeLeft}s</p>
                <p>Score : {score}</p>
            </div>
            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => (
                            <div
                                key={colIndex}
                                className="cell"
                                style={{
                                    backgroundColor: getCellColor(cell),
                                    width: "40px",
                                    height: "40px",
                                    border: "1px solid #ddd",
                                }}
                                onClick={() => handleClick(rowIndex, colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IceMeltingGame;
import React, { useState, useEffect } from "react";
import "./CreditsIMTeo.css";

const ROWS = 11; // Nombre de lignes
const COLS = 11; // Nombre de colonnes

const CreditsIMTeo: React.FC<{ onGameEnd: () => void }> = ({ onGameEnd }) => {
    const [grid, setGrid] = useState<string[][]>([]);
    const [timerActive, setTimerActive] = useState(false); // Pour activer le timer
    const [timeLeft, setTimeLeft] = useState(5); // Temps avant l'action finale (5 secondes)

    const T_POSITION = { row: 4, col: 3 };
    const É_POSITION = { row: 4, col: 4 };
    const O_POSITION = { row: 4, col: 5 };
    const M_POSITION = { row: 6, col: 3 };
    const O2_POSITION = { row: 6, col: 4 };
    const E_POSITION = { row: 6, col: 5 };
    const R_POSITION = { row: 6, col: 6 };
    const E2_POSITION = { row: 6, col: 7 };
    const L_POSITION = { row: 6, col: 8 };

    // Initialisation de la grille
    useEffect(() => {
        const centerRow = Math.floor(ROWS / 2);
        const centerCol = Math.floor(COLS / 2);
        const maxDistance = Math.min(ROWS, COLS) / 3 + 1;

        const initialGrid = Array.from({ length: ROWS }, (_, rowIndex) =>
            Array.from({ length: COLS }, (_, colIndex) => {
                const distance = Math.abs(rowIndex - centerRow) + Math.abs(colIndex - centerCol);
                return distance <= maxDistance ? "white" : "blue";
            })
        );
        setGrid(initialGrid);
    }, []);

    // Animation des teintes rouges
    useEffect(() => {
        const interval = setInterval(() => {
            setGrid((prevGrid) =>
                prevGrid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        if (cell.startsWith("white-red-")) {
                            const level = parseInt(cell.split("-")[2]);
                            if (level >= 10) {
                                return "blue";
                            }
                            return `white-red-${level + 1}`;
                        }
                        if (cell === "white" && hasAdjacentBlue(prevGrid, rowIndex, colIndex)) {
                            return "white-red-1";
                        }
                        return cell;
                    })
                )
            );
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Vérification : Démarre le timer quand il n'y a plus de pavés blancs
    useEffect(() => {
        if (!grid.flat().includes("white") && !timerActive) {
            setTimerActive(true);
        }
    }, [grid, timerActive]);

    useEffect(() => {
        if (timerActive) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        onGameEnd(); // Appelle la fonction pour changer de scène
                    }
                    return prevTime - 1;
                });
            }, 1250);
            return () => clearInterval(timer);
        }
    }, [timerActive, onGameEnd]);

    const hasAdjacentBlue = (grid: string[][], row: number, col: number) => {
        const directions = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ];
        return directions.some(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            return grid[newRow]?.[newCol] === "blue";
        });
    };

    const getCellColor = (cell: string) => {
        if (cell === "blue") return "#0000FF";
        if (cell === "white") return "#FFFFFF";
        if (cell.startsWith("white-red-")) {
            const level = parseInt(cell.split("-")[2]);
            const red = Math.min(255, level * 25);
            return `rgb(${red}, ${255 - red}, 255)`;
        }
        return "#000000";
    };

    return (
        <div className="game">
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
                                    position: "relative",
                                }}
                            >
                                {T_POSITION.row === rowIndex && T_POSITION.col === colIndex && <span>T</span>}
                                {É_POSITION.row === rowIndex && É_POSITION.col === colIndex && <span>É</span>}
                                {O_POSITION.row === rowIndex && O_POSITION.col === colIndex && <span>O</span>}
                                {M_POSITION.row === rowIndex && M_POSITION.col === colIndex && <span>M</span>}
                                {O2_POSITION.row === rowIndex && O2_POSITION.col === colIndex && <span>O</span>}
                                {E_POSITION.row === rowIndex && E_POSITION.col === colIndex && <span>E</span>}
                                {R_POSITION.row === rowIndex && R_POSITION.col === colIndex && <span>R</span>}
                                {E2_POSITION.row === rowIndex && E2_POSITION.col === colIndex && <span>E</span>}
                                {L_POSITION.row === rowIndex && L_POSITION.col === colIndex && <span>L</span>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreditsIMTeo;

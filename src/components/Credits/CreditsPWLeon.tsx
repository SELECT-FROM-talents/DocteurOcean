import React, { useState, useEffect, useRef } from "react";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const LETTER_SIZE = 40;

const LETTERS = ["L", "É", "O", "N", "F", "I", "E", "V", "E", "T"];

// Générer une position aléatoire pour les lettres
const getRandomPosition = () => {
    const x = Math.random() * (GAME_WIDTH - LETTER_SIZE);
    const y = Math.random() * (GAME_HEIGHT - LETTER_SIZE);
    return { x, y };
};

const PlasticWasteGame: React.FC = () => {
    const [letters, setLetters] = useState<{ id: string; x: number; y: number; char: string }[]>([]);
    const [teleporting, setTeleporting] = useState(false); // Contrôle le début de la téléportation
    const gameAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Diviser les lettres en trois lots
        const batch1 = LETTERS.slice(0, 4).map((char) => ({
            id: `letter-${char}-${Date.now()}-${Math.random()}`,
            char,
            ...getRandomPosition(),
        }));
        const batch2 = LETTERS.slice(4, 7).map((char) => ({
            id: `letter-${char}-${Date.now()}-${Math.random()}`,
            char,
            ...getRandomPosition(),
        }));
        const batch3 = LETTERS.slice(7).map((char) => ({
            id: `letter-${char}-${Date.now()}-${Math.random()}`,
            char,
            ...getRandomPosition(),
        }));

        // Ajouter les lots de lettres progressivement
        setLetters(batch1);

        const timer1 = setTimeout(() => {
            setLetters((prev) => [...prev, ...batch2]);
        }, 1000); // Afficher le deuxième lot après 3 secondes

        const timer2 = setTimeout(() => {
            setLetters((prev) => [...prev, ...batch3]);
        }, 2000); // Afficher le troisième lot après 6 secondes

        // Début de la téléportation après 9 secondes
        const teleportTimer = setTimeout(() => {
            setTeleporting(true);
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(teleportTimer);
        };
    }, []);

    // Calculer la position finale des lettres (LÉON et FIEVET)
    const getFinalPosition = (char: string, index: number) => {
        const centerX = GAME_WIDTH / 2 - LETTER_SIZE * 2; // Centrer "LÉON"
        const centerY = GAME_HEIGHT / 2 - LETTER_SIZE;

        if (["L", "É", "O", "N"].includes(char)) {
            // Positionner "LÉON" au centre
            return {
                x: centerX + index * LETTER_SIZE,
                y: centerY,
            };
        } else {
            // Positionner "FIEVET" en dessous de "LÉON"
            const offsetX = index * LETTER_SIZE - 4 * LETTER_SIZE; // Décalage horizontal
            return {
                x: centerX + offsetX,
                y: centerY + LETTER_SIZE * 2, // Décalage vertical
            };
        }
    };

    return (
        <div
            ref={gameAreaRef}
            style={{
                position: "relative",
                width: `${GAME_WIDTH}px`,
                height: `${GAME_HEIGHT}px`,
                backgroundColor: "#f0f0f0",
                border: "2px solid #333",
                borderRadius: "8px",
                margin: "0 auto",
                overflow: "hidden",
            }}
        >
            {letters.map((letter, index) => {
                const finalPosition = getFinalPosition(letter.char, index);
                return (
                    <div
                        key={letter.id}
                        style={{
                            position: "absolute",
                            left: teleporting ? finalPosition.x : letter.x,
                            top: teleporting ? finalPosition.y : letter.y,
                            width: `${LETTER_SIZE}px`,
                            height: `${LETTER_SIZE}px`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#fff",
                            backgroundColor: "#1976d2",
                            borderRadius: "4px",
                            transition: "all 1s ease", // Transition fluide pour la téléportation
                        }}
                    >
                        {letter.char}
                    </div>
                );
            })}
        </div>
    );
};

export default PlasticWasteGame;

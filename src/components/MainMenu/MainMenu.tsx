import { useGame } from '@/contexts/GameContext';
import { GameScene } from '@/types/game.types';
import confetti from 'canvas-confetti';
import './MainMenu.css';
import {useEffect, useState} from "react";

// Définir le chemin de base en fonction de l'environnement
const BASE_PATH = import.meta.env.MODE === 'production' ? '/DocteurOcean' : '';

export const MainMenu = () => {
    const { dispatch } = useGame();

    const [xPos, setXPos] = useState<number>(
        Math.floor(Math.random() * (window.innerWidth - 100))
    );
    const [yPos, setYPos] = useState<number>(
        Math.floor(Math.random() * (window.innerHeight - 100))
    );
    const [currentLogo, setCurrentLogo] = useState<string>('lyreco1.png');
    const [visible, setVisible] = useState<boolean>(true);

    const logos = ['lyreco1.png', 'lyreco2.png', 'lyreco3.png'] as const;

    const moveLogo = () => {
        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 100;
        setXPos(Math.random() * maxX);
        setYPos(Math.random() * maxY);
    };

    const getRandomLogo = (): string => {
        return logos[Math.floor(Math.random() * logos.length)] || 'lyreco1.png';
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setCurrentLogo(getRandomLogo());
                moveLogo();
                setVisible(true);
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleStartGame = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.CLINIC });
    };

    const handleShowTutorial = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.TUTORIAL });
    };

    const handleShowAbout = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.ABOUT });
    };

    const handleShowCredits = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.CREDITS });
    };

    const handleRedirectToErgonomie = () => {
        window.location.href = `${BASE_PATH}/ergonomie/ergonomie.html`;
    };

    return (
        <div className="main-menu-container">
            <div className="menu-content">
                <h1 className="game-title">Voyage Intérieur</h1>
                <p className="game-subtitle">Plongez dans votre océan intérieur pour vous guérir</p>

                <div className="menu-buttons">
                    <button
                        className="menu-button start"
                        onClick={handleStartGame}
                    >
                        Commencer le Voyage
                        <span className="button-description">
              Explorez votre monde intérieur et guérissez-vous
            </span>
                    </button>
                </div>

                <div className="menu-options">
                    <button
                        className="menu-button tutorial"
                        onClick={handleShowTutorial}
                    >
                        Comment Jouer
                        <span className="button-description">
              Découvrez vos pouvoirs et apprenez à naviguer dans vos rêves
            </span>
                    </button>

                    <button
                        className="menu-button about"
                        onClick={handleShowAbout}
                    >
                        À Propos
                        <span className="button-description">
              Comprendre la métaphore entre l'océan et votre santé
            </span>
                    </button>
                </div>

                <p> Dans Docteur Océan, vous incarnez un médecin pas comme les autres...</p>

                <div className="menu-footer">
                    <div className="ocean-facts">
                        <p>Saviez-vous que...</p>
                        <p className="fact">Comme l'océan, votre corps est composé à 70% d'eau</p>
                    </div>
                    <button
                        className="menu-button credits"
                        onClick={handleShowCredits}
                    >
                        Crédits
                    </button>
                    <button
                        className="menu-button ergonomie"
                        onClick={handleRedirectToErgonomie}
                    >
                        Ergonomie
                    </button>
                </div>
            </div>

            {/* Logo dans le menu principal */}
            <div
                style={{
                    left: `${xPos}px`,
                    top: `${yPos}px`,
                }}
                className={`logo ${!visible ? 'hidden' : ''}`}
                onClick={() => confetti()}
            >
                <img
                    src={`${currentLogo}`}
                    alt="Logo Lyreco"
                    className="logo-image"
                />
            </div>
        </div>
    );
};
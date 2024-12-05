import { useGame } from '@/contexts/GameContext';
import { GameScene } from '@/types/game.types';
import './MainMenu.css';

export const MainMenu = () => {
    const { dispatch } = useGame();

    const handleStartGame = () => {
        dispatch({ type: 'CHANGE_SCENE', payload: GameScene.CLINIC });
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
                    <button className="menu-button tutorial">
                        Comment Jouer
                        <span className="button-description">
                            Découvrez vos pouvoirs et apprenez à naviguer dans vos rêves
                        </span>
                    </button>

                    <button className="menu-button about">
                        À Propos
                        <span className="button-description">
                            Comprendre la métaphore entre l'océan et votre santé
                        </span>
                    </button>
                </div>

                <div className="menu-footer">
                    <div className="ocean-facts">
                        <p>Saviez-vous que...</p>
                        <p className="fact">Comme l'océan, votre corps est composé à 70% d'eau</p>
                    </div>
                    <button className="menu-button credits">
                        Crédits
                    </button>
                </div>
            </div>
        </div>
    );
};
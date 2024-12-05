import { useGame } from '@/contexts/GameContext';
import { GameScene, GameDifficulty } from '@/types/game.types';
import './MainMenu.css';

export const MainMenu = () => {
    const { dispatch } = useGame();

    const handleStartGame = (difficulty: GameDifficulty) => {
        dispatch({ type: 'UPDATE_DIFFICULTY', payload: difficulty });
        dispatch({ type: 'CHANGE_SCENE', payload: GameScene.CLINIC });
    };

    return (
        <div className="main-menu-container">
            <div className="menu-content">
                <h1 className="game-title">Docteur Ocean</h1>
                <p className="game-subtitle">Guérissez vos patients à travers leurs rêves marins</p>

                <div className="menu-buttons">
                    <button
                        className="menu-button easy"
                        onClick={() => handleStartGame(GameDifficulty.EASY)}
                    >
                        Mode Facile
                        <span className="button-description">Pour débuter en douceur</span>
                    </button>

                    <button
                        className="menu-button normal"
                        onClick={() => handleStartGame(GameDifficulty.NORMAL)}
                    >
                        Mode Normal
                        <span className="button-description">Pour les médecins expérimentés</span>
                    </button>

                    <button
                        className="menu-button hard"
                        onClick={() => handleStartGame(GameDifficulty.HARD)}
                    >
                        Mode Difficile
                        <span className="button-description">Pour les maîtres des océans</span>
                    </button>
                </div>

                <div className="menu-footer">
                    <button className="menu-button tutorial">
                        Tutorial
                    </button>
                    <button className="menu-button credits">
                        Crédits
                    </button>
                </div>
            </div>
        </div>
    );
};
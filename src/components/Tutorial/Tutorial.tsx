import { useGame } from '@/contexts/GameContext';
import { GameScene } from '@/types/game.types';
import './Tutorial.css';

export const Tutorial = () => {
    const { dispatch } = useGame();

    const handleBack = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.MAIN_MENU }); // Changé de 'CHANGE_SCENE' à 'SET_SCENE'
    };

    return (
        <div className="tutorial-container">
            <div className="tutorial-content">
                <h1>Comment Jouer</h1>

                <div className="tutorial-section">
                    <h2>La Clinique</h2>
                    <p>Commencez votre voyage dans la clinique...</p>
                </div>

                <div className="tutorial-section">
                    <h2>Le Monde des Rêves</h2>
                    <p>Explorez votre océan intérieur...</p>
                </div>

                <div className="tutorial-section">
                    <h2>Vos Pouvoirs</h2>
                    <p>Découvrez vos capacités de guérison...</p>
                </div>

                <button className="back-button" onClick={handleBack}>
                    Retour au Menu
                </button>
            </div>
        </div>
    );
};
import { useGame } from '@/contexts/GameContext';
import { GameScene } from '@/types/game.types';
import './About.css';

export const About = () => {
    const { dispatch } = useGame();

    const handleBack = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.MAIN_MENU });
    };

    return (
        <div className="about-container">
            <div className="about-content">
                <h1>À Propos</h1>
                <div className="about-text">
                    <h2>La Métaphore de l'Océan</h2>
                    <p>Découvrez comment votre corps est semblable à un océan...</p>

                    <h2>Le Processus de Guérison</h2>
                    <p>Comprendre comment la guérison intérieure fonctionne...</p>
                </div>

                <button className="back-button" onClick={handleBack}>
                    Retour au Menu
                </button>
            </div>
        </div>
    );
};
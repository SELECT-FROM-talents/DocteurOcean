import { useGame } from '@/contexts/GameContext';
import { GameScene } from '@/types/game.types';
import { Clinic } from './CreditsClinic';
import './Credits.css';

export const Credits = () => {
    const { dispatch } = useGame();

    const handleBack = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.MAIN_MENU });
    };

    return (
        <div className="credits-container">
            <Clinic onDialogEnd={handleBack} />
            <div className="credits-content">
                <h1>Crédits</h1>

                <div className="credits-section">
                    <h2>Développement</h2>
                    <p>Liste des développeurs...</p>
                </div>

                <div className="credits-section">
                    <h2>Design</h2>
                    <p>Liste des designers...</p>
                </div>

                <div className="credits-section">
                    <h2>Musique</h2>
                    <p>Liste des compositeurs...</p>
                </div>

                <button className="back-button" onClick={handleBack}>
                    Retour au Menu
                </button>
            </div>
        </div>
    );
};
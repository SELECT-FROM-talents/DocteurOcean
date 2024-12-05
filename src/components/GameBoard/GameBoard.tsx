import { useGame } from '@/contexts/GameContext';
import { useClickInteraction } from '@/hooks/useClickInteraction';
import { GameScene } from '@/types/game.types';
import { MainMenu } from '../MainMenu/MainMenu';
import { Clinic } from '../Clinic/Clinic';
import { DreamWorld } from '../DreamWorld/DreamWorld';
import './GameBoard.css';

export const GameBoard = () => {
    const { state } = useGame();

    const renderScene = () => {
        switch (state.currentScene) {
            case GameScene.MAIN_MENU:
                return <MainMenu />;

            case GameScene.CLINIC:
                return <Clinic />;

            case GameScene.DREAM_WORLD:
                return <DreamWorld />;

            default:
                return <div>Scene inconnue</div>;
        }
    };

    return (
        <div className="game-board">
            {renderScene()}
            <div className="game-ui">
                {state.currentScene !== GameScene.MAIN_MENU && (
                    <>
                        <div className="score">Score: {state.score}</div>
                        <div className="stats">
                            Patients guéris: {state.stats.patientsHealed}
                            <br />
                            Temps: {Math.floor(state.stats.timeElapsed / 60)}:{(state.stats.timeElapsed % 60).toString().padStart(2, '0')}
                        </div>
                    </>
                )}
                {state.isPaused && <div className="pause-overlay">PAUSE</div>}
            </div>
        </div>
    );
};
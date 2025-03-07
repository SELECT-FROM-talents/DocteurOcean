import { useGame } from '@/contexts/GameContext';
import { GameScene } from '@/types/game.types';
import { MainMenu } from '../MainMenu/MainMenu';
import { Clinic } from '../Clinic/Clinic';
import { DreamWorld } from '../DreamWorld/DreamWorld';
import { About } from '../About/About';
import { Tutorial } from '../Tutorial/Tutorial';
import { CreditsGameBoard } from '../Credits/CreditsGameBoard';
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
            case GameScene.ABOUT:
                return <About />;
            case GameScene.TUTORIAL:
                return <Tutorial />;
            case GameScene.CREDITS:
                // @ts-ignore
                return <CreditsGameBoard />;
            default:
                return <div>Scene inconnue</div>;
        }
    };

    if(state.currentScene === GameScene.CREDITS) {

        return (
            <div className="game-board">
                {renderScene()}
                <div className="game-ui">
                    {(
                        <>
                            <div className="score">Nuit de l'info: 05-06 décembre 2024</div>
                            <div className="stats">
                                Assistans du docteur: SELECT * FROM Talents
                                <br/>
                                Temps: {Math.floor(state.stats.timeElapsed / 60)}:{(state.stats.timeElapsed % 60).toString().padStart(2, '0')}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <div className="game-board">
                {renderScene()}
                <div className="game-ui">
                    {state.currentScene !== GameScene.MAIN_MENU && (
                        <>
                            <div className="score">Score: {state.score}</div>
                            <div className="stats">
                                Patients guéris: {state.stats.patientsHealed}
                                <br/>
                                Temps: {Math.floor(state.stats.timeElapsed / 60)}:{(state.stats.timeElapsed % 60).toString().padStart(2, '0')}
                            </div>
                        </>
                    )}
                    {state.isPaused && <div className="pause-overlay">PAUSE</div>}
                </div>
            </div>
        );
    }
};
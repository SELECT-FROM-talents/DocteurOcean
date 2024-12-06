import { useGame } from '@/contexts/GameContext';
import { GameScene } from '@/types/game.types';
import './MainMenu.css';

export const MainMenu = () => {
    const { dispatch } = useGame();

    const handleStartGame = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.CLINIC });  // Changé de 'CHANGE_SCENE' à 'SET_SCENE'
    };

    const handleShowTutorial = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.TUTORIAL });  // Changé de 'CHANGE_SCENE' à 'SET_SCENE'
    };

    const handleShowAbout = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.ABOUT });  // Changé de 'CHANGE_SCENE' à 'SET_SCENE'
    };

    const handleShowCredits = () => {
        dispatch({ type: 'SET_SCENE', payload: GameScene.CREDITS });  // Changé de 'CHANGE_SCENE' à 'SET_SCENE'
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

                <p> Dans Docteur Océan, vous incarnez un médecin pas comme les autres. Votre mission : sauver les océans
                    en soignant des patients dont les maux représentent les problèmes qui menacent nos écosystèmes
                    marins.</p>
                <p>Quand un patient arrive dans votre cabinet avec un problème aux poumons, c'est en réalité une
                    barrière de corail qui se dégrade. Pour le guérir, vous l'envoyez dans le DreamWorld, un univers
                    onirique où son corps devient un vaste océan. En accomplissant différentes tâches dans ce monde,
                    vous pourrez soigner le patient et par la même occasion, sensibiliser les joueurs aux enjeux
                    cruciaux de la pollution marine.</p>
                <p>Docteur Océan est plus qu'un jeu, c'est une expérience ludique et pédagogique qui révèle les liens
                    étroits entre la santé des hommes et celle de nos océans. Préparez-vous à une plongée à la fois
                    surprenante et engagée, où vos talents de médecin serviront une cause essentielle : la protection de
                    la vie sous-marine et de sa biodiversité.</p>
                <p>Avec son gameplay original et son propos écologique fort, Docteur Océan embarquera petits et grands
                    dans une aventure aussi amusante qu'enrichissante. Alors, prêts à enfiler votre blouse blanche pour
                    devenir un défenseur des océans ?</p>

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
                </div>
            </div>
        </div>
    );
};
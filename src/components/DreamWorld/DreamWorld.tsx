import { useGame } from '@/contexts/GameContext';
import './DreamWorld.css';

export const DreamWorld = () => {
    const { state } = useGame();

    return (
        <div className="dream-world-scene">
            <div className="dream-world-background">
                <h2>Le Monde des Rêves</h2>
                {/* Le contenu du monde des rêves viendra ici */}
            </div>
        </div>
    );
};
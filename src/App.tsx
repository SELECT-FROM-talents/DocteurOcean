import { GameProvider } from './contexts/GameContext';
import { GameBoard } from './components/GameBoard/GameBoard';
import { CreditsGameBoard} from "@/components/Credits/CreditsGameBoard.tsx";
import './App.css';

const App = () => {
    return (
        <GameProvider>
            <div className="game-container">
                <GameBoard />
            </div>
        </GameProvider>
    );
};

export default App;
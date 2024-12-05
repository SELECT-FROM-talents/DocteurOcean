import { useCallback, useState } from 'react';
import { Position } from '@/types/game.types';

interface UseClickInteractionProps {
    onInteraction?: (position: Position) => void;
    boundary?: {
        width: number;
        height: number;
    };
}

export const useClickInteraction = ({
                                        onInteraction,
                                        boundary = { width: window.innerWidth, height: window.innerHeight }
                                    }: UseClickInteractionProps = {}) => {
    const [lastClickPosition, setLastClickPosition] = useState<Position | null>(null);

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const position: Position = {
                x: Math.min(Math.max(0, event.clientX - rect.left), boundary.width),
                y: Math.min(Math.max(0, event.clientY - rect.top), boundary.height)
            };

            setLastClickPosition(position);
            onInteraction?.(position);
        },
        [boundary, onInteraction]
    );

    return {
        lastClickPosition,
        handleClick
    };
};
import type { GameState } from "@/types/game/game";
import React, { useEffect, useRef } from "react";

interface PlayerProps {
  gameState: GameState;
  onUpdate: (position: number) => void;
}

const PLAYER_SPEED = 8;
const PLAYER_WIDTH = 48;
const GAME_WIDTH = 800;

export const Player: React.FC<PlayerProps> = ({ gameState, onUpdate }) => {
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const updatePosition = () => {
      let newPosition = gameState.playerPosition;

      if (gameState.keysPressed.has("ArrowLeft")) {
        newPosition -= PLAYER_SPEED;
      }
      if (gameState.keysPressed.has("ArrowRight")) {
        newPosition += PLAYER_SPEED;
      }

      newPosition = Math.max(
        0,
        Math.min(GAME_WIDTH - PLAYER_WIDTH, newPosition),
      );
      if (newPosition !== gameState.playerPosition) {
        onUpdate(newPosition);
      }

      frameRef.current = requestAnimationFrame(updatePosition);
    };

    frameRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameState, onUpdate]);

  return (
    <div
      className="position-absolute bottom-0 mb-4"
      style={{
        left: `${gameState.playerPosition}px`,
        width: "48px",
        height: "32px",
        backgroundColor: "#198754",
      }}
    />
  );
};

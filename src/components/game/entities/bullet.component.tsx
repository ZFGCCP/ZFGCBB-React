import type { SpaceGameObject, SpaceGameState } from "@/types/game/game";
import React, { useEffect, useRef } from "react";

interface BulletProps extends SpaceGameObject {
  gameState: SpaceGameState;
  onUpdate: (updates: Partial<SpaceGameObject>) => void;
  onRemove: () => void;
  onGameTick: (
    callback: (deltaTime: number, timestamp: number) => void,
  ) => () => void;
  speed: number;
}

export const Bullet: React.FC<BulletProps> = ({
  id,
  x,
  y,
  width,
  height,
  isAlive,
  gameState,
  onUpdate,
  onRemove,
  onGameTick,
  speed,
}) => {
  useEffect(() => {
    if (!isAlive || !gameState.isRunning) return;

    return onGameTick((deltaTime) => {
      const deltaSeconds = deltaTime / 1000;
      const movement = speed * deltaSeconds;
      const newY = y - movement;

      if (newY < -height) {
        onRemove();
      } else {
        onUpdate({ y: newY });
      }
    });
  }, [
    y,
    height,
    isAlive,
    gameState.isRunning,
    onUpdate,
    onRemove,
    onGameTick,
    speed,
  ]);

  if (!isAlive) return null;

  return (
    <div
      className="position-absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#ffc107",
        borderRadius: "2px",
        transform: `translate3d(0,0,0)`,
        willChange: "transform",
        imageRendering: "pixelated",
      }}
    />
  );
};

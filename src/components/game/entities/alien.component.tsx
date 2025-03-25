import type { SpaceGameObject, SpaceGameState } from "@/types/game/game";
import React, { useEffect, useRef } from "react";

interface AlienProps extends SpaceGameObject {
  gameState: SpaceGameState;
  onUpdate: (updates: Partial<SpaceGameObject>) => void;
  onBulletHit: (id: string) => void;
  onScoreUpdate: () => void;
  bullets: SpaceGameObject[];
}

export const Alien: React.FC<AlienProps> = ({
  id,
  x,
  y,
  width,
  height,
  isAlive,
  gameState,
  onUpdate,
  onBulletHit,
  onScoreUpdate,
  bullets,
}) => {
  React.useEffect(() => {
    if (!isAlive || !gameState.isRunning) return;

    bullets.forEach((bullet) => {
      if (!bullet.isAlive) return;

      if (
        bullet.x < x + width &&
        bullet.x + bullet.width > x &&
        bullet.y < y + height &&
        bullet.y + bullet.height > y
      ) {
        onBulletHit(bullet.id);
        onUpdate({ isAlive: false });
        onScoreUpdate();
      }
    });
  }, [
    bullets,
    x,
    y,
    width,
    height,
    isAlive,
    gameState.isRunning,
    onUpdate,
    onBulletHit,
    onScoreUpdate,
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
        backgroundColor: "#6f42c1",
        transform: `translate3d(0,0,0)`,
        willChange: "transform",
        imageRendering: "pixelated",
      }}
    />
  );
};

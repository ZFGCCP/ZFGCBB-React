import type { GameObject, GameState } from "@/types/game/game";
import React, { useEffect, useRef } from "react";

interface BulletProps extends GameObject {
  gameState: GameState;
  onUpdate: (bullet: GameObject) => void;
}

const BULLET_SPEED = 7;

export const Bullet: React.FC<BulletProps> = ({
  x,
  y,
  gameState,
  onUpdate,
}) => {
  const frameRef = useRef<number>(0);
  const bulletRef = useRef<GameObject>({ x, y });

  useEffect(() => {
    const updatePosition = () => {
      bulletRef.current = {
        x: bulletRef.current.x,
        y: bulletRef.current.y - BULLET_SPEED,
      };

      onUpdate(bulletRef.current);
      frameRef.current = requestAnimationFrame(updatePosition);
    };

    frameRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [onUpdate]);

  return (
    <div
      className="position-absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: "4px",
        height: "16px",
        backgroundColor: "#ffc107",
      }}
    />
  );
};

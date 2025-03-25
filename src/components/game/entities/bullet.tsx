import type {
  SpaceGameState,
  Dimensions,
  SpaceGameObject,
} from "@/types/game/game";
import { Bullet } from "./bullet.component";
import { useRef, useCallback, useEffect } from "react";

interface BulletControllerProps {
  gameState: SpaceGameState;
  dimensions: Dimensions;
  onBulletUpdate: (id: string, updates: Partial<SpaceGameObject>) => void;
  onBulletRemove: (id: string) => void;
  onGameTick: (
    callback: (deltaTime: number, timestamp: number) => void,
  ) => () => void;
  getAllObjects: () => SpaceGameObject[];
}

const BULLET_SPEED = 500;

export const BulletController: React.FC<BulletControllerProps> = ({
  gameState,
  dimensions,
  onBulletUpdate,
  onBulletRemove,
  onGameTick,
  getAllObjects,
}) => {
  const bullets = getAllObjects().filter(
    (obj) => obj.id.startsWith("bullet-") && obj.isAlive,
  );

  return (
    <>
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          {...bullet}
          gameState={gameState}
          onUpdate={(updates) => onBulletUpdate(bullet.id, updates)}
          onRemove={() => {
            onBulletRemove(bullet.id);
            onBulletUpdate(bullet.id, { isAlive: false });
          }}
          onGameTick={onGameTick}
          speed={BULLET_SPEED * (dimensions.height / 600)}
        />
      ))}
    </>
  );
};

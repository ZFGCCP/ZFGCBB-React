import type {
  SpaceGameState,
  Dimensions,
  SpaceGameObject,
} from "@/types/game/game";
import { useCallback, useEffect } from "react";
import { Alien } from "./alien.component";

const HORIZONTAL_STEP = 20;
const DROP_DISTANCE = 30;
const EDGE_MARGIN = 20;
const MIN_STEP_TIME = 200;
const MAX_STEP_TIME = 750;

interface AlienControllerProps {
  gameState: SpaceGameState;
  dimensions: Dimensions;
  onAlienUpdate: (id: string, updates: Partial<SpaceGameObject>) => void;
  onBulletHit: (id: string) => void;
  onScoreUpdate: () => void;
  onGameTick: (
    callback: (deltaTime: number, timestamp: number) => void,
  ) => () => void;
  getAllObjects: () => SpaceGameObject[];
}

export const AlienController: React.FC<AlienControllerProps> = ({
  gameState,
  dimensions,
  onAlienUpdate,
  onBulletHit,
  onScoreUpdate,
  onGameTick,
  getAllObjects,
}) => {
  const checkAlienBoundaries = useCallback(() => {
    const aliens = getAllObjects().filter(
      (obj) => obj.id.startsWith("alien-") && obj.isAlive,
    );
    if (aliens.length === 0) return { needsChange: false, hitBottom: false };

    const leftmostX = Math.min(...aliens.map((alien) => alien.x));
    const rightmostX = Math.max(
      ...aliens.map((alien) => alien.x + alien.width),
    );
    const lowestY = Math.max(...aliens.map((alien) => alien.y + alien.height));

    const hitBottom = lowestY > dimensions.height * 0.8;
    const needsChange =
      (gameState.alienDirection < 0 && leftmostX <= EDGE_MARGIN) ||
      (gameState.alienDirection > 0 &&
        rightmostX >= dimensions.width - EDGE_MARGIN);

    return { needsChange, hitBottom };
  }, [
    dimensions.width,
    dimensions.height,
    gameState.alienDirection,
    getAllObjects,
  ]);

  useEffect(() => {
    if (!gameState.isRunning || gameState.gameOver) return;

    return onGameTick((_, timestamp) => {
      if (timestamp - gameState.alienLastStep < gameState.alienStepTime) return;

      const aliens = getAllObjects().filter(
        (obj) => obj.id.startsWith("alien-") && obj.isAlive,
      );
      if (aliens.length === 0) return;

      const { needsChange, hitBottom } = checkAlienBoundaries();

      if (hitBottom) {
        gameState.gameOver = true;
        return;
      }

      aliens.forEach((alien) => {
        const newX = alien.x + HORIZONTAL_STEP * gameState.alienDirection;
        onAlienUpdate(alien.id, { x: newX });
      });

      if (needsChange) {
        aliens.forEach((alien) => {
          const newY = alien.y + DROP_DISTANCE;
          onAlienUpdate(alien.id, { y: newY });
        });
        gameState.alienDirection *= -1;
      }

      const initialAlienCount = 24;
      const remainingRatio = aliens.length / initialAlienCount;
      gameState.alienStepTime = Math.max(
        MIN_STEP_TIME,
        MAX_STEP_TIME * remainingRatio,
      );
      gameState.alienLastStep = timestamp;
    });
  }, [
    gameState,
    onAlienUpdate,
    onGameTick,
    checkAlienBoundaries,
    getAllObjects,
  ]);

  const aliens = getAllObjects().filter((obj) => obj.id.startsWith("alien-"));
  const bullets = getAllObjects().filter((obj) => obj.id.startsWith("bullet-"));

  return (
    <>
      {aliens.map((alien) => (
        <Alien
          key={alien.id}
          {...alien}
          gameState={gameState}
          bullets={bullets}
          onUpdate={(updates) => onAlienUpdate(alien.id, updates)}
          onBulletHit={onBulletHit}
          onScoreUpdate={onScoreUpdate}
        />
      ))}
    </>
  );
};

import { useGameObjects } from "@/hooks/game/useGameObject";
import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { AlienController } from "../entities/alien";
import { DebugPanel } from "../entities/debug.component";
import { PlayerController } from "../entities/player";
import { BulletController } from "../entities/bullet";
import { useGameLayout } from "@/hooks/game/useGameLayout";
import type {
  SpaceGameState,
  DebugData,
  Dimensions,
  SpaceGameEntities,
  SpaceGameObject,
} from "@/types/game/game";

interface GameBoardProps {
  gameState: SpaceGameState;
  debugData: DebugData;
  dimensions: Dimensions;
  dimensionsRef: React.RefObject<Dimensions>;
  gameStateRef: React.RefObject<SpaceGameState>;
  entitiesRef: React.RefObject<SpaceGameEntities>;
  updateGameState: () => void;
  onScoreUpdate: () => void;
  onGameTick: (
    callback: (deltaTime: number, timestamp: number) => void,
  ) => () => void;
  score: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  debugData,
  dimensions,
  dimensionsRef,
  gameStateRef,
  entitiesRef,
  updateGameState,
  onScoreUpdate,
  onGameTick,
  score,
}) => {
  const {
    addObject,
    removeObject,
    updateObject,
    getObjectsByType,
    clearObjects,
    objectsRef,
  } = useGameObjects();

  const layout = useGameLayout(dimensions, {
    minWidth: 320,
    minHeight: 480,
    maxWidth: 1200,
    maxHeight: 900,
    aspectRatio: 4 / 3,
  });

  const getAllObjects = useCallback(() => {
    return Array.from(objectsRef.current.objects.values());
  }, []);

  const handleBulletCreate = useCallback(
    (id: string, bullet: Partial<SpaceGameObject>) => {
      addObject({
        ...(bullet as unknown as SpaceGameObject),
        id,
        type: "bullet",
        color: "#ffc107",
        isAlive: true,
      });
    },
    [addObject],
  );

  const handleBulletUpdate = useCallback(
    (id: string, updates: Partial<SpaceGameObject>) => {
      updateObject(id, updates);
    },
    [updateObject],
  );

  const handleBulletRemove = useCallback(
    (id: string) => {
      removeObject(id);
    },
    [removeObject],
  );

  const handleAlienUpdate = useCallback(
    (id: string, updates: Partial<SpaceGameObject>) => {
      updateObject(id, updates);
    },
    [updateObject],
  );

  useEffect(() => {
    if (!gameState.gameStarted) {
      clearObjects();
    }
  }, [gameState.gameStarted, clearObjects]);

  const getAlienFormation = useCallback(
    (screenWidth: number, screenHeight: number) => {
      const isLandscape = screenWidth > screenHeight;
      return isLandscape ? { rows: 3, cols: 6 } : { rows: 4, cols: 4 };
    },
    [],
  );

  const getAlienDimensions = useCallback(
    (screenWidth: number, screenHeight: number) => {
      const formation = getAlienFormation(screenWidth, screenHeight);
      const alienWidth = Math.min(screenWidth / (formation.cols * 2), 40);
      return {
        width: alienWidth,
        spacing: {
          horizontal: alienWidth * 2,
          vertical: alienWidth * 2,
        },
      };
    },
    [getAlienFormation],
  );

  const getStartPosition = useCallback(
    (screenWidth: number, screenHeight: number) => {
      const formation = getAlienFormation(screenWidth, screenHeight);
      const alienDims = getAlienDimensions(screenWidth, screenHeight);

      const startX =
        (screenWidth - formation.cols * alienDims.spacing.horizontal) / 2;
      const verticalSpace = screenHeight - 120;
      const formationHeight = formation.rows * alienDims.spacing.vertical;
      const startY = Math.max(
        screenHeight * 0.1,
        Math.min(screenHeight * 0.2, (verticalSpace - formationHeight) * 0.3),
      );

      return { startX, startY };
    },
    [getAlienFormation, getAlienDimensions],
  );

  useEffect(() => {
    const objects = getAllObjects();
    if (objects.length === 0 && gameState.gameStarted && !gameState.gameOver) {
      const formation = getAlienFormation(dimensions.width, dimensions.height);
      const alienDims = getAlienDimensions(dimensions.width, dimensions.height);
      const { startX, startY } = getStartPosition(
        dimensions.width,
        dimensions.height,
      );

      for (let row = 0; row < formation.rows; row++) {
        for (let col = 0; col < formation.cols; col++) {
          const id = `alien-${row}-${col}`;
          addObject({
            id,
            type: "alien",
            color: "#6f42c1",
            x: startX + col * alienDims.spacing.horizontal,
            y: startY + row * alienDims.spacing.vertical,
            width: alienDims.width,
            height: alienDims.width,
            isAlive: true,
          });
        }
      }
    } else if (objects.length > 0) {
      const aliens = objects.filter(
        (obj) => obj.id.startsWith("alien-") && obj.isAlive,
      );
      if (aliens.length > 0) {
        const formation = getAlienFormation(
          dimensions.width,
          dimensions.height,
        );
        const alienDims = getAlienDimensions(
          dimensions.width,
          dimensions.height,
        );
        const { startX, startY } = getStartPosition(
          dimensions.width,
          dimensions.height,
        );

        aliens.forEach((alien) => {
          const [, row, col] = alien.id.match(/alien-(\d+)-(\d+)/) || [];
          if (row !== undefined && col !== undefined) {
            const newX = startX + Number(col) * alienDims.spacing.horizontal;
            const newY = startY + Number(row) * alienDims.spacing.vertical;
            updateObject(alien.id, {
              x: newX,
              y: newY,
              width: alienDims.width,
              height: alienDims.width,
            });
          }
        });
      }
    }
  }, [
    dimensions,
    gameState.gameStarted,
    gameState.gameOver,
    addObject,
    updateObject,
    getAllObjects,
    getAlienFormation,
    getAlienDimensions,
    getStartPosition,
  ]);

  useEffect(() => {
    if (entitiesRef.current) {
      entitiesRef.current.objects = objectsRef.current.objects;
    }
  }, [entitiesRef]);

  return (
    <>
      <div className="position-absolute top-0 start-0 p-3 text-white fs-4">
        Score: {score}
      </div>

      <PlayerController
        gameState={gameState}
        dimensions={dimensions}
        onPositionUpdate={(position) => {
          if (gameStateRef.current) {
            gameStateRef.current.playerPosition = position;
            updateGameState();
          }
        }}
        onGameTick={onGameTick}
        onBulletCreate={handleBulletCreate}
      />

      <AlienController
        gameState={gameState}
        dimensions={dimensions}
        onAlienUpdate={handleAlienUpdate}
        onBulletHit={handleBulletRemove}
        onScoreUpdate={onScoreUpdate}
        onGameTick={onGameTick}
        getAllObjects={getAllObjects}
      />

      <BulletController
        gameState={gameState}
        dimensions={dimensions}
        onBulletUpdate={handleBulletUpdate}
        onBulletRemove={handleBulletRemove}
        onGameTick={onGameTick}
        getAllObjects={getAllObjects}
      />
    </>
  );
};

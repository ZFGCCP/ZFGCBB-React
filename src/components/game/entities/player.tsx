import React, { useCallback, useEffect, useRef } from "react";
import { Player } from "./player.component";
import {
  useInputHandler,
  type InputBinding,
} from "@/hooks/game/useInputHandler";
import type {
  SpaceGameState,
  Dimensions,
  SpaceGameObject,
} from "@/types/game/game";

const BASE_SPEED = 400;
const MAX_VELOCITY = 800;
const ACCELERATION = 2000;
const DECELERATION = 2500;
const BULLET_COOLDOWN = 250;

type PlayerAction = "moveLeft" | "moveRight" | "shoot";

interface PlayerControllerProps {
  gameState: SpaceGameState;
  dimensions: Dimensions;
  onPositionUpdate: (position: number) => void;
  onGameTick: (
    callback: (deltaTime: number, timestamp: number) => void,
  ) => () => void;
  onBulletCreate: (id: string, bullet: Partial<SpaceGameObject>) => void;
}

const PLAYER_INPUT_BINDINGS: InputBinding<PlayerAction>[] = [
  { key: "ArrowLeft", pointerZone: "left", action: "moveLeft" },
  { key: "ArrowRight", pointerZone: "right", action: "moveRight" },
  { key: " ", pointerZone: "center", action: "shoot" },
];

export const PlayerController: React.FC<PlayerControllerProps> = ({
  gameState,
  dimensions,
  onPositionUpdate,
  onGameTick,
  onBulletCreate,
}) => {
  const baseSize = Math.min(dimensions.width, dimensions.height) * 0.08;
  const playerWidthRef = useRef(baseSize);
  const lastBulletTimeRef = useRef(0);
  const shootingRef = useRef(false);
  const movementRef = useRef({ left: false, right: false });
  const velocityRef = useRef(0);
  const playerSpeed = useRef(BASE_SPEED * (dimensions.width / 800));

  useEffect(() => {
    gameState.playerWidth = playerWidthRef.current;
  }, [gameState, dimensions]);

  const createBullet = useCallback(() => {
    if (gameState.gameOver || !gameState.isRunning) return;

    const now = performance.now();
    if (now - lastBulletTimeRef.current < BULLET_COOLDOWN) return;

    const bulletWidth = Math.min(dimensions.width, dimensions.height) * 0.01;
    const bulletHeight = bulletWidth * 4;

    onBulletCreate(`bullet-${now}`, {
      x:
        gameState.playerPosition + playerWidthRef.current / 2 - bulletWidth / 2,
      y: dimensions.height - 80,
      width: bulletWidth,
      height: bulletHeight,
      isAlive: true,
    });

    lastBulletTimeRef.current = now;
  }, [
    dimensions,
    gameState.playerPosition,
    gameState.gameOver,
    gameState.isRunning,
    onBulletCreate,
  ]);

  useEffect(() => {
    if (!gameState.isRunning || gameState.gameOver) return;

    return onGameTick((deltaTime) => {
      const deltaSeconds = deltaTime / 1000;
      let newPosition = gameState.playerPosition;

      if (movementRef.current.left) {
        velocityRef.current = Math.max(
          -MAX_VELOCITY,
          velocityRef.current - ACCELERATION * deltaSeconds,
        );
      } else if (movementRef.current.right) {
        velocityRef.current = Math.min(
          MAX_VELOCITY,
          velocityRef.current + ACCELERATION * deltaSeconds,
        );
      } else {
        if (Math.abs(velocityRef.current) < DECELERATION * deltaSeconds) {
          velocityRef.current = 0;
        } else {
          velocityRef.current -=
            Math.sign(velocityRef.current) * DECELERATION * deltaSeconds;
        }
      }

      newPosition += velocityRef.current * deltaSeconds;

      if (newPosition < 0) {
        newPosition = 0;
        velocityRef.current *= -0.5;
      } else if (newPosition > dimensions.width - playerWidthRef.current) {
        newPosition = dimensions.width - playerWidthRef.current;
        velocityRef.current *= -0.5;
      }

      if (newPosition !== gameState.playerPosition) {
        onPositionUpdate(newPosition);
      }

      if (shootingRef.current) {
        createBullet();
      }
    });
  }, [
    dimensions.width,
    gameState.playerPosition,
    gameState.gameOver,
    gameState.isRunning,
    onPositionUpdate,
    onGameTick,
    createBullet,
  ]);

  const handleAction = useCallback(
    (action: PlayerAction, start: boolean) => {
      if (gameState.gameOver || !gameState.isRunning) return;

      switch (action) {
        case "moveLeft":
          movementRef.current.left = start;
          break;
        case "moveRight":
          movementRef.current.right = start;
          break;
        case "shoot":
          shootingRef.current = start;
          if (start) {
            createBullet();
          }
          break;
      }
    },
    [gameState.gameOver, gameState.isRunning, createBullet],
  );

  useInputHandler({
    bindings: PLAYER_INPUT_BINDINGS,
    onAction: handleAction,
    element: document.querySelector("[data-game-container]") as HTMLElement,
    preventDefault: true,
    touchEnabled: true,
    mouseEnabled: true,
    keyboardEnabled: true,
  });

  return (
    <Player
      gameState={gameState}
      dimensions={dimensions}
      width={playerWidthRef.current}
    />
  );
};

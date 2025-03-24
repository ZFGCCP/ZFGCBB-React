import React, { useEffect, useState, useCallback, useRef } from "react";
import { Player } from "./entities/player.component";
import { Alien } from "./entities/alien.component";
import { Bullet } from "./entities/bullet.component";
import type { GameObject, GameState } from "@/types/game/game";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const ALIEN_ROWS = 3;
const ALIENS_PER_ROW = 8;
const FPS = 60;
const FRAME_TIME = 1000 / FPS;
const ALIEN_SPEED = 1;
const ALIEN_DROP_DISTANCE = 30;

export const Game: React.FC = () => {
  const gameStateRef = useRef<GameState>({
    playerPosition: GAME_WIDTH / 2,
    alienDirection: 1,
    score: 0,
    gameOver: false,
    keysPressed: new Set(),
  });

  const [gameState, setGameState] = useState<GameState>(gameStateRef.current);
  const [spacePressed, setSpacePressed] = useState(false);

  const aliensRef = useRef<GameObject[]>([]);
  const bulletsRef = useRef<GameObject[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const lastAlienUpdateRef = useRef<number>(0);
  const ALIEN_UPDATE_INTERVAL = 16; // Update aliens every 16ms

  const updateGameState = useCallback(() => {
    setGameState({ ...gameStateRef.current });
  }, []);

  const initializeGame = useCallback(() => {
    aliensRef.current = [];
    for (let row = 0; row < ALIEN_ROWS; row++) {
      for (let col = 0; col < ALIENS_PER_ROW; col++) {
        aliensRef.current.push({
          x: col * 80 + 100,
          y: row * 60 + 50,
          isAlive: true,
        });
      }
    }

    bulletsRef.current = [];
    gameStateRef.current = {
      playerPosition: GAME_WIDTH / 2,
      alienDirection: 1,
      score: 0,
      gameOver: false,
      keysPressed: new Set(),
    };
    setSpacePressed(false);
    updateGameState();
  }, [updateGameState]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameStateRef.current.gameOver) return;
      gameStateRef.current.keysPressed.add(e.key);

      if (e.code === "Space" && !spacePressed) {
        e.preventDefault();
        setSpacePressed(true);
        bulletsRef.current.push({
          x: gameStateRef.current.playerPosition + 23,
          y: GAME_HEIGHT - 40,
        });
      }
      updateGameState();
    },
    [spacePressed, updateGameState],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      gameStateRef.current.keysPressed.delete(e.key);
      if (e.code === "Space") {
        setSpacePressed(false);
      }
      updateGameState();
    },
    [updateGameState],
  );

  const updateAliens = useCallback((timestamp: number) => {
    if (timestamp - lastAlienUpdateRef.current < ALIEN_UPDATE_INTERVAL) {
      return;
    }

    let shouldChangeDirection = false;
    let needToDropDown = false;

    // Check boundaries for all aliens first
    for (const alien of aliensRef.current) {
      if (!alien.isAlive) continue;
      const nextX = alien.x + ALIEN_SPEED * gameStateRef.current.alienDirection;
      if (nextX <= 0 || nextX >= GAME_WIDTH - 32) {
        shouldChangeDirection = true;
        needToDropDown = true;
        break;
      }
    }

    // Update all aliens
    aliensRef.current = aliensRef.current.map((alien) => {
      if (!alien.isAlive) return alien;
      return {
        ...alien,
        x:
          alien.x +
          (shouldChangeDirection
            ? 0
            : ALIEN_SPEED * gameStateRef.current.alienDirection),
        y: alien.y + (needToDropDown ? ALIEN_DROP_DISTANCE : 0),
        isAlive: alien.isAlive,
      };
    });

    if (shouldChangeDirection) {
      gameStateRef.current.alienDirection *= -1;
    }

    lastAlienUpdateRef.current = timestamp;
  }, []);

  const updateGame = useCallback(
    (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastFrameTimeRef.current;

      if (deltaTime >= FRAME_TIME) {
        updateAliens(timestamp);

        // Check collisions
        bulletsRef.current.forEach((bullet, bulletIndex) => {
          aliensRef.current.forEach((alien, alienIndex) => {
            if (!alien.isAlive) return;

            if (
              bullet.x >= alien.x &&
              bullet.x <= alien.x + 32 &&
              bullet.y >= alien.y &&
              bullet.y <= alien.y + 32
            ) {
              aliensRef.current[alienIndex] = { ...alien, isAlive: false };
              bulletsRef.current.splice(bulletIndex, 1);
              gameStateRef.current.score += 100;
            }
          });
        });

        // Check if any alien reached the bottom
        const aliensReachedBottom = aliensRef.current.some(
          (alien) => alien.isAlive && alien.y + 32 >= GAME_HEIGHT - 60,
        );

        if (aliensReachedBottom) {
          gameStateRef.current.gameOver = true;
        }

        // Check if all aliens are destroyed
        const anyAliveAliens = aliensRef.current.some((alien) => alien.isAlive);
        if (!anyAliveAliens) {
          gameStateRef.current.gameOver = true;
        }

        lastFrameTimeRef.current = timestamp;
        updateGameState();
      }

      if (!gameStateRef.current.gameOver) {
        animationFrameRef.current = requestAnimationFrame(updateGame);
      }
    },
    [updateAliens, updateGameState],
  );

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (!gameStateRef.current.gameOver) {
      lastFrameTimeRef.current = 0;
      lastAlienUpdateRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.gameOver, updateGame]);

  return (
    <div
      className="position-relative"
      style={{
        width: "800px",
        height: "600px",
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      {gameState.gameOver ? (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h2 className="display-5 text-white mb-3">Game Over!</h2>
            <p className="text-white fs-3 mb-4">
              Final Score: {gameState.score}
            </p>
            <button
              onClick={initializeGame}
              className="btn btn-success btn-lg px-4 py-2"
            >
              Play Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="position-absolute top-0 start-0 p-3 text-white fs-4">
            Score: {gameState.score}
          </div>
          <Player
            gameState={gameStateRef.current}
            onUpdate={(position) => {
              gameStateRef.current.playerPosition = position;
            }}
          />
          {aliensRef.current.map((alien, index) => (
            <Alien key={index} {...alien} />
          ))}
          {bulletsRef.current.map((bullet, index) => (
            <Bullet
              key={index}
              {...bullet}
              gameState={gameStateRef.current}
              onUpdate={(updatedBullet) => {
                if (updatedBullet.y <= 0) {
                  bulletsRef.current.splice(index, 1);
                } else {
                  bulletsRef.current[index] = updatedBullet;
                }
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

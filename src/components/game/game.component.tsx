import React, { useEffect, useState, useCallback, useRef } from "react";
import { Player } from "./entities/player.component";
import { Alien } from "./entities/alien.component";
import { Bullet } from "./entities/bullet.component";

interface Alien {
  x: number;
  y: number;
  isAlive: boolean;
}

interface Bullet {
  x: number;
  y: number;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 8;
const BULLET_SPEED = 7;
const ALIEN_ROWS = 3;
const ALIENS_PER_ROW = 8;
const ALIEN_SPEED = 1;
const ALIEN_DROP_DISTANCE = 30;
const PLAYER_WIDTH = 48;
const PLAYER_HEIGHT = 32;
const FPS = 60;
const FRAME_TIME = 1000 / FPS;

export const Game: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState(GAME_WIDTH / 2);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [alienDirection, setAlienDirection] = useState(1);
  const [spacePressed, setSpacePressed] = useState(false);
  const [aliens, setAliens] = useState<Alien[]>(() => {
    const initAliens: Alien[] = [];
    for (let row = 0; row < ALIEN_ROWS; row++) {
      for (let col = 0; col < ALIENS_PER_ROW; col++) {
        initAliens.push({
          x: col * 80 + 100,
          y: row * 60 + 50,
          isAlive: true,
        });
      }
    }
    return initAliens;
  });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  const lastFrameTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const initializeGame = useCallback(() => {
    setPlayerPosition(GAME_WIDTH / 2);
    setBullets([]);
    setAlienDirection(1);
    setSpacePressed(false);
    setGameOver(false);
    setScore(0);
    setKeysPressed(new Set());
    setAliens(() => {
      const initAliens: Alien[] = [];
      for (let row = 0; row < ALIEN_ROWS; row++) {
        for (let col = 0; col < ALIENS_PER_ROW; col++) {
          initAliens.push({
            x: col * 80 + 100,
            y: row * 60 + 50,
            isAlive: true,
          });
        }
      }
      return initAliens;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;
      setKeysPressed((prev) => new Set(prev).add(e.key));

      if (e.code === "Space" && !spacePressed) {
        e.preventDefault();
        setSpacePressed(true);
        setBullets((prev) => [
          ...prev,
          {
            x: playerPosition + PLAYER_WIDTH / 2 - 1,
            y: GAME_HEIGHT - PLAYER_HEIGHT - 8,
          },
        ]);
      }
    },
    [gameOver, playerPosition, spacePressed],
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeysPressed((prev) => {
      const newKeys = new Set(prev);
      newKeys.delete(e.key);
      return newKeys;
    });

    if (e.code === "Space") {
      setSpacePressed(false);
    }
  }, []);

  const updateGame = useCallback(
    (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastFrameTimeRef.current;

      if (deltaTime >= FRAME_TIME) {
        setPlayerPosition((prev) => {
          let newPosition = prev;
          if (keysPressed.has("ArrowLeft")) {
            newPosition -= PLAYER_SPEED;
          }
          if (keysPressed.has("ArrowRight")) {
            newPosition += PLAYER_SPEED;
          }
          return Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, newPosition));
        });

        setBullets((prev) => {
          return prev
            .map((bullet) => ({ ...bullet, y: bullet.y - BULLET_SPEED }))
            .filter((bullet) => bullet.y > 0);
        });

        setAliens((prevAliens) => {
          let shouldChangeDirection = false;
          let needToDropDown = false;

          prevAliens.forEach((alien) => {
            if (!alien.isAlive) return;
            const nextX = alien.x + ALIEN_SPEED * alienDirection;
            if (nextX <= 0 || nextX >= GAME_WIDTH - 32) {
              shouldChangeDirection = true;
            }
          });

          if (shouldChangeDirection) {
            needToDropDown = true;
          }

          const newAliens = prevAliens.map((alien) => {
            if (!alien.isAlive) return alien;
            return {
              ...alien,
              x: alien.x + ALIEN_SPEED * alienDirection,
              y: needToDropDown ? alien.y + ALIEN_DROP_DISTANCE : alien.y,
            };
          });

          if (shouldChangeDirection) {
            setAlienDirection((prev) => prev * -1);
          }

          const aliensReachedBottom = newAliens.some(
            (alien) => alien.isAlive && alien.y + 32 >= GAME_HEIGHT - 60,
          );

          if (aliensReachedBottom) {
            setGameOver(true);
          }

          return newAliens;
        });

        setBullets((prev) => {
          const remainingBullets = [...prev];
          setAliens((prevAliens) => {
            return prevAliens.map((alien) => {
              if (!alien.isAlive) return alien;

              const hitByBullet = remainingBullets.findIndex(
                (bullet) =>
                  bullet.x >= alien.x &&
                  bullet.x <= alien.x + 32 &&
                  bullet.y >= alien.y &&
                  bullet.y <= alien.y + 32,
              );

              if (hitByBullet !== -1) {
                remainingBullets.splice(hitByBullet, 1);
                setScore((prev) => prev + 100);
                return { ...alien, isAlive: false };
              }

              return alien;
            });
          });
          return remainingBullets;
        });

        setAliens((prev) => {
          const anyAliveAliens = prev.some((alien) => alien.isAlive);
          if (!anyAliveAliens) {
            setGameOver(true);
          }
          return prev;
        });

        lastFrameTimeRef.current = timestamp;
      }

      if (!gameOver) {
        animationFrameRef.current = requestAnimationFrame(updateGame);
      }
    },
    [gameOver, keysPressed, alienDirection],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (!gameOver) {
      lastFrameTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameOver, updateGame]);

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
      {gameOver ? (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h2 className="display-5 text-white mb-3">Game Over!</h2>
            <p className="text-white fs-3 mb-4">Final Score: {score}</p>
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
            Score: {score}
          </div>
          <Player position={playerPosition} />
          {aliens.map((alien, index) => (
            <Alien key={index} {...alien} />
          ))}
          {bullets.map((bullet, index) => (
            <Bullet key={index} {...bullet} />
          ))}
        </>
      )}
    </div>
  );
};

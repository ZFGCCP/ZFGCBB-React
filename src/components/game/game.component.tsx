import React, { useEffect, useState, useCallback, useRef } from "react";

import { useGameEngine } from "@/hooks/game/useGameEngine";
import { DebugPanel } from "./entities/debug.component";
import { ScreenManager } from "./screenManager.component";
import type { GameEngineState, Dimensions, DebugData } from "@/types/game/game";

interface GameProps<TState extends GameEngineState, TEntities> {
  initialState: TState;
  minDimensions: Dimensions;
  maxDimensions: Dimensions;
  aspectRatio: number;
  renderTitle: (props: { onStartGame: () => void }) => React.ReactNode;
  renderGameOver: (props: { onRestart: () => void }) => React.ReactNode;
  renderGame: (props: {
    gameState: TState;
    debugData: DebugData;
    dimensions: Dimensions;
    dimensionsRef: React.RefObject<Dimensions>;
    gameStateRef: React.RefObject<TState>;
    entitiesRef: React.RefObject<TEntities>;
    updateGameState: () => void;
    onGameTick: (
      callback: (deltaTime: number, timestamp: number) => void,
    ) => () => void;
    canvasRef: React.RefObject<HTMLCanvasElement>;
  }) => React.ReactNode;
}

export const Game = <TState extends GameEngineState, TEntities>({
  initialState,
  minDimensions,
  maxDimensions,
  aspectRatio,
  renderTitle,
  renderGameOver,
  renderGame,
}: GameProps<TState, TEntities>) => {
  const [dimensions, setDimensions] = useState<Dimensions>(minDimensions);
  const dimensionsRef = useRef<Dimensions>(minDimensions);
  const [gameState, setGameState] = useState<TState>(initialState);
  const [debugData, setDebugData] = useState<DebugData>({
    fps: 0,
    entities: 0,
    gameState: "initializing",
    memoryUsage: 0,
    timeRunning: 0,
    updateLag: 0,
    vsyncFps: 0,
  });

  const gameStateRef = useRef<TState>(gameState);
  const entitiesRef = useRef<TEntities>({} as TEntities);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debugUpdateRef = useRef({
    lastUpdate: 0,
    frames: 0,
    startTime: 0,
  });

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const updateDebugInfo = useCallback(
    (fps: number, vsyncFps: number, updateLag: number) => {
      const now = performance.now();

      setDebugData((prev) => ({
        ...prev,
        fps,
        vsyncFps,
        updateLag,
        gameState: gameState.gameOver
          ? "game over"
          : gameState.isPaused
            ? "paused"
            : gameState.isRunning
              ? "running"
              : "stopped",
        // @ts-expect-error ignore this
        entities: entitiesRef.current?.objects?.size || 0,
        memoryUsage:
          // @ts-expect-error ignore this
          Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024) || 0,
        timeRunning: Math.round(
          (now - debugUpdateRef.current.startTime) / 1000,
        ),
      }));
    },
    [gameState.gameOver, gameState.isPaused, gameState.isRunning],
  );

  const {
    updateGame,
    startGame,
    stopGame,
    onGameTick,
    getCurrentFps,
    getVsyncFps,
    getUpdateLag,
  } = useGameEngine(gameStateRef, dimensionsRef, {
    onUpdate: () => {
      setGameState((prevState) => ({
        ...prevState,
        ...gameStateRef.current,
      }));
      updateDebugInfo(getCurrentFps(), getVsyncFps(), getUpdateLag());
    },
    maxUpdateLag: 250,
    targetFps: 60,
    vsyncEnabled: true,
    interpolationEnabled: true,
  });

  const handleDimensionsChange = useCallback(
    (width: number, height: number) => {
      const newDimensions: Dimensions = { width, height };
      dimensionsRef.current = newDimensions;
      setDimensions(newDimensions);

      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
      }

      gameStateRef.current = {
        ...gameStateRef.current,
        width,
        height,
      };
    },
    [],
  );

  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      debugUpdateRef.current = {
        lastUpdate: performance.now(),
        frames: 0,
        startTime: performance.now(),
      };
      startGame();
    } else if (gameState.gameOver) {
      stopGame();
    }
  }, [gameState.gameStarted, gameState.gameOver, startGame, stopGame]);

  const handleRestart = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      gameOver: false,
      isRunning: true,
      isPaused: false,
    }));
    debugUpdateRef.current = {
      lastUpdate: performance.now(),
      frames: 0,
      startTime: performance.now(),
    };
  }, []);

  return (
    <ScreenManager
      onDimensionsChange={handleDimensionsChange}
      minDimensions={minDimensions}
      maxDimensions={maxDimensions}
      aspectRatio={aspectRatio}
    >
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0"
        style={{
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
        }}
      />

      <DebugPanel
        data={debugData}
        title="Game Stats"
        position="top-right"
        theme="dark"
      />

      {!gameState.gameStarted
        ? renderTitle({
            onStartGame: () =>
              setGameState((prev) => ({
                ...prev,
                gameStarted: true,
                isRunning: true,
              })),
          })
        : gameState.gameOver
          ? renderGameOver({
              onRestart: handleRestart,
            })
          : renderGame({
              gameState,
              debugData,
              dimensions,
              dimensionsRef,
              gameStateRef,
              entitiesRef,
              updateGameState: () => {
                setGameState((prevState) => ({
                  ...prevState,
                  ...gameStateRef.current,
                }));
              },
              onGameTick,
              canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
            })}
    </ScreenManager>
  );
};

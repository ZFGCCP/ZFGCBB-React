import { useCallback, useRef } from "react";
import {
  useFrameGenerator,
  type FrameGeneratorOptions,
} from "./useFrameGenerator";
import type { AnimationCallback } from "@/types/game/game";

interface GameEngineState {
  isRunning: boolean;
  isPaused: boolean;
  width: number;
  height: number;
}

interface GameEngineOptions extends FrameGeneratorOptions {
  onUpdate?: () => void;
  maxUpdateLag?: number;
}

export const useGameEngine = (
  stateRef: React.RefObject<GameEngineState>,
  dimensionsRef: React.RefObject<{ width: number; height: number }>,
  options: GameEngineOptions = {},
) => {
  const {
    onUpdate,
    maxUpdateLag = 250,
    targetFps = 60,
    isServer = false,
    vsyncEnabled = true,
    interpolationEnabled = true,
    ...frameOptions
  } = options;

  const gameTickCallbacksRef = useRef<AnimationCallback[]>([]);
  const lastUpdateTimeRef = useRef<number>(0);
  const updateLagRef = useRef<number>(0);

  const onGameTick = useCallback((callback: AnimationCallback) => {
    gameTickCallbacksRef.current.push(callback);
    return () => {
      gameTickCallbacksRef.current = gameTickCallbacksRef.current.filter(
        (cb) => cb !== callback,
      );
    };
  }, []);

  const updateGame = useCallback(
    (timestamp: number, deltaTime: number) => {
      if (!stateRef.current.isRunning || stateRef.current.isPaused) {
        lastUpdateTimeRef.current = timestamp;
        updateLagRef.current = 0;
        return;
      }

      updateLagRef.current = lastUpdateTimeRef.current
        ? timestamp - lastUpdateTimeRef.current
        : 0;
      lastUpdateTimeRef.current = timestamp;

      if (updateLagRef.current > maxUpdateLag) {
        updateLagRef.current = 0;
        return;
      }

      for (const callback of gameTickCallbacksRef.current) {
        try {
          callback(deltaTime, timestamp);
        } catch (error) {
          console.error("Error in game tick callback:", error);
        }
      }

      if (onUpdate) {
        try {
          onUpdate();
        } catch (error) {
          console.error("Error in game update callback:", error);
        }
      }
    },
    [onUpdate, maxUpdateLag],
  );

  const {
    start: startFrames,
    stop: stopFrames,
    getCurrentFps,
    getVsyncFps,
  } = useFrameGenerator(updateGame, {
    targetFps,
    isServer,
    vsyncEnabled,
    interpolationEnabled,
    ...frameOptions,
  });

  const startGame = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.isRunning = true;
      stateRef.current.isPaused = false;
      lastUpdateTimeRef.current = 0;
      updateLagRef.current = 0;
    }
    startFrames();
  }, [startFrames]);

  const pauseGame = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.isPaused = true;
      lastUpdateTimeRef.current = 0;
      updateLagRef.current = 0;
    }
    stopFrames();
  }, [stopFrames]);

  const resumeGame = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.isPaused = false;
      lastUpdateTimeRef.current = 0;
      updateLagRef.current = 0;
      startFrames();
    }
  }, [startFrames]);

  const stopGame = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.isRunning = false;
      lastUpdateTimeRef.current = 0;
      updateLagRef.current = 0;
    }
    stopFrames();
  }, [stopFrames]);

  return {
    updateGame,
    startGame,
    pauseGame,
    resumeGame,
    stopGame,
    onGameTick,
    getCurrentFps,
    getVsyncFps,
    getUpdateLag: () => updateLagRef.current,
  };
};

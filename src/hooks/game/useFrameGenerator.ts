import { useCallback, useEffect, useRef } from "react";

export interface FrameGeneratorOptions {
  targetFps?: number;
  isServer?: boolean;
  vsyncEnabled?: boolean;
  interpolationEnabled?: boolean;
}

interface FrameState {
  accumulator: number;
  lastFrameTime: number;
  frameCount: number;
  frameTimer: number;
  currentFps: number;
  vsyncFps: number;
}

export function useFrameGenerator(
  callback: (timestamp: number, deltaTime: number) => void,
  options: FrameGeneratorOptions = {},
) {
  const {
    targetFps = 60,
    isServer = typeof window === "undefined",
    vsyncEnabled = true,
    interpolationEnabled = true,
  } = options;

  const frameRef = useRef<number>(undefined);
  const intervalRef = useRef<NodeJS.Timeout>(undefined);
  const frameState = useRef<FrameState>({
    accumulator: 0,
    lastFrameTime: 0,
    frameCount: 0,
    frameTimer: 0,
    currentFps: targetFps,
    vsyncFps: 60,
  });

  const animate = useCallback(
    (timestamp: number) => {
      if (!frameState.current.lastFrameTime) {
        frameState.current.lastFrameTime = timestamp;
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const actualDeltaTime = Math.min(
        timestamp - frameState.current.lastFrameTime,
        100,
      );
      frameState.current.lastFrameTime = timestamp;

      frameState.current.frameCount++;
      if (timestamp - frameState.current.frameTimer >= 1000) {
        frameState.current.currentFps = frameState.current.frameCount;
        frameState.current.frameCount = 0;
        frameState.current.frameTimer = timestamp;
      }

      const fixedTimeStep = 1000 / targetFps;
      frameState.current.accumulator += actualDeltaTime;

      while (frameState.current.accumulator >= fixedTimeStep) {
        callback(timestamp, fixedTimeStep);
        frameState.current.accumulator -= fixedTimeStep;
      }

      if (interpolationEnabled && frameState.current.accumulator > 0) {
        const alpha = frameState.current.accumulator / fixedTimeStep;
        callback(timestamp, fixedTimeStep * alpha);
      }

      frameRef.current = requestAnimationFrame(animate);
    },
    [callback, targetFps, interpolationEnabled],
  );

  const startClientAnimation = useCallback(() => {
    if (frameRef.current) return;

    frameState.current = {
      ...frameState.current,
      accumulator: 0,
      lastFrameTime: 0,
      frameCount: 0,
      frameTimer: performance.now(),
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stopClientAnimation = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
  }, []);

  const startServerAnimation = useCallback(() => {
    if (intervalRef.current) return;

    const frameInterval = 1000 / targetFps;
    let lastTime = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const deltaTime = Math.min(now - lastTime, 100);
      lastTime = now;

      callback(now, frameInterval);

      frameState.current.frameCount++;
      if (now - frameState.current.frameTimer >= 1000) {
        frameState.current.currentFps = frameState.current.frameCount;
        frameState.current.frameCount = 0;
        frameState.current.frameTimer = now;
      }
    }, frameInterval);
  }, [callback, targetFps]);

  const stopServerAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let frameCount = 0;
      let lastTime = performance.now();
      let rafId: number;

      const detectRefreshRate = (timestamp: number) => {
        frameCount++;
        const elapsed = timestamp - lastTime;

        if (elapsed >= 1000) {
          frameState.current.vsyncFps = Math.round(
            (frameCount * 1000) / elapsed,
          );
          return;
        }

        rafId = requestAnimationFrame(detectRefreshRate);
      };

      rafId = requestAnimationFrame(detectRefreshRate);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }
  }, []);

  useEffect(() => {
    const start = isServer ? startServerAnimation : startClientAnimation;
    const stop = isServer ? stopServerAnimation : stopClientAnimation;

    start();
    return () => stop();
  }, [
    isServer,
    startClientAnimation,
    stopClientAnimation,
    startServerAnimation,
    stopServerAnimation,
  ]);

  return {
    start: isServer ? startServerAnimation : startClientAnimation,
    stop: isServer ? stopServerAnimation : stopClientAnimation,
    getCurrentFps: () => frameState.current.currentFps,
    getVsyncFps: () => frameState.current.vsyncFps,
  };
}

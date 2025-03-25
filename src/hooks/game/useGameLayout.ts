import type { Dimensions } from "@/types/game/game";
import { useCallback, useEffect, useMemo } from "react";

interface LayoutOptions {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: number;
  onDimensionsChange?: (width: number, height: number) => void;
}

const getDevicePixelRatio = () => {
  return typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
};

const getDPIAdjustedSize = (size: number) => {
  const dpr = getDevicePixelRatio();
  return size * (1 / Math.max(1, Math.min(dpr, 2)));
};

export function calculateLayout(
  dimensions: Dimensions,
  options: LayoutOptions = {},
) {
  const {
    minWidth = 320,
    minHeight = 480,
    maxWidth = 1200,
    maxHeight = 900,
    aspectRatio = 4 / 3,
  } = options;

  const { width, height } = dimensions;
  const currentAspectRatio = width / height;
  const isLandscape = currentAspectRatio >= 1;

  let gameWidth, gameHeight;

  if (isLandscape) {
    gameHeight = Math.max(minHeight, Math.min(height, width / aspectRatio));
    gameWidth = Math.max(minWidth, Math.min(width, gameHeight * aspectRatio));
  } else {
    gameWidth = Math.max(minWidth, Math.min(width, height / aspectRatio));
    gameHeight = Math.max(minHeight, Math.min(height, gameWidth * aspectRatio));
  }

  if (gameWidth > maxWidth) {
    gameWidth = maxWidth;
    gameHeight = gameWidth / aspectRatio;
  }
  if (gameHeight > maxHeight) {
    gameHeight = maxHeight;
    gameWidth = gameHeight * aspectRatio;
  }

  return {
    width: Math.round(gameWidth),
    height: Math.round(gameHeight),
    isLandscape,
    scale: getDPIAdjustedSize(1),
    dpr: getDevicePixelRatio(),
  };
}

export function useGameLayout(dimensions: Dimensions, options?: LayoutOptions) {
  const layout = useMemo(
    () => calculateLayout(dimensions, options),
    [dimensions.width, dimensions.height, options],
  );

  const handleResize = useCallback(() => {
    const newLayout = calculateLayout(dimensions, options);
    options?.onDimensionsChange?.(newLayout.width, newLayout.height);
  }, [dimensions, options]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  return layout;
}

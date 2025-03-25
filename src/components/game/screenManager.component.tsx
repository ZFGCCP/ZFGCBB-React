import type { Dimensions } from "@/types/game/game";
import React, { useEffect, useCallback, useRef } from "react";

interface ScreenManagerProps {
  children: React.ReactNode;
  onDimensionsChange: (width: number, height: number) => void;
  minDimensions: Dimensions;
  maxDimensions: Dimensions;
  aspectRatio: number;
}

export const ScreenManager: React.FC<ScreenManagerProps> = ({
  children,
  onDimensionsChange,
  minDimensions,
  maxDimensions,
  aspectRatio,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensionsRef = useRef<Dimensions>(minDimensions);

  const updateDimensions = useCallback(() => {
    if (!containerRef.current?.parentElement) return;

    const container = containerRef.current.parentElement;
    const parentStyle = window.getComputedStyle(container);
    const parentPadding = {
      horizontal:
        parseFloat(parentStyle.paddingLeft) +
        parseFloat(parentStyle.paddingRight),
      vertical:
        parseFloat(parentStyle.paddingTop) +
        parseFloat(parentStyle.paddingBottom),
    };

    const availableWidth = Math.min(
      container.clientWidth - parentPadding.horizontal,
      maxDimensions.width,
    );
    const availableHeight = Math.min(
      window.innerHeight * 0.7 - parentPadding.vertical,
      maxDimensions.height,
    );
    const currentAspectRatio = availableWidth / availableHeight;
    const isLandscape = currentAspectRatio >= aspectRatio;

    let gameWidth, gameHeight;

    if (isLandscape) {
      gameHeight = Math.max(
        minDimensions.height,
        Math.min(availableHeight, availableWidth / aspectRatio),
      );
      gameWidth = Math.max(
        minDimensions.width,
        Math.min(availableWidth, gameHeight * aspectRatio),
      );
    } else {
      gameWidth = Math.max(
        minDimensions.width,
        Math.min(availableWidth, availableHeight * aspectRatio),
      );
      gameHeight = Math.max(
        minDimensions.height,
        Math.min(availableHeight, gameWidth / aspectRatio),
      );
    }

    gameWidth = Math.round(gameWidth);
    gameHeight = Math.round(gameHeight);

    if (
      Math.abs(gameWidth - dimensionsRef.current.width) > 1 ||
      Math.abs(gameHeight - dimensionsRef.current.height) > 1
    ) {
      dimensionsRef.current = { width: gameWidth, height: gameHeight };
      onDimensionsChange(gameWidth, gameHeight);
    }
  }, [onDimensionsChange, minDimensions, maxDimensions, aspectRatio]);

  useEffect(() => {
    const handleResize = () => {
      updateDimensions();
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(handleResize);

    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [updateDimensions]);

  return (
    <div
      ref={containerRef}
      data-game-container
      className="position-relative mx-auto"
      style={{
        width: `${dimensionsRef.current.width}px`,
        height: `${dimensionsRef.current.height}px`,
        backgroundColor: "black",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      {children}
    </div>
  );
};

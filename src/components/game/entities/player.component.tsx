import type { SpaceGameState, Dimensions } from "@/types/game/game";

interface PlayerProps {
  gameState: SpaceGameState;
  dimensions: Dimensions;
  width: number;
}

export const Player: React.FC<PlayerProps> = ({
  gameState,
  dimensions,
  width,
}) => {
  const playerHeight = width * 0.9;

  return (
    <div
      className="position-absolute"
      style={{
        left: `${gameState.playerPosition}px`,
        bottom: "40px",
        width: `${width}px`,
        height: `${playerHeight}px`,
        backgroundColor: "#198754",
        transform: `translate3d(0,0,0)`,
        willChange: "transform",
        imageRendering: "pixelated",
        cursor: "none",
      }}
    />
  );
};

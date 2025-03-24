import type { GameObject } from "@/types/game/game";
import React from "react";

type AlienProps = GameObject;

export const Alien: React.FC<AlienProps> = ({ x, y, isAlive }) => {
  if (!isAlive) return null;

  return (
    <div
      className="position-absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: "32px",
        height: "32px",
        backgroundColor: "#6f42c1",
      }}
    />
  );
};

import React from "react";

interface PlayerProps {
  position: number;
}

export const Player: React.FC<PlayerProps> = ({ position }) => {
  return (
    <div
      className="position-absolute bottom-0 mb-4"
      style={{
        left: `${position}px`,
        width: "48px",
        height: "32px",
        backgroundColor: "#198754",
      }}
    />
  );
};

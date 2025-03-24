import React from "react";

interface BulletProps {
  x: number;
  y: number;
}

export const Bullet: React.FC<BulletProps> = ({ x, y }) => {
  return (
    <div
      className="position-absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: "4px",
        height: "16px",
        backgroundColor: "#ffc107",
      }}
    />
  );
};

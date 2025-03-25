import type { DebugData } from "@/types/game/game";
import React from "react";

interface DebugPanelProps {
  data: DebugData;
  title?: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  theme?: "dark" | "light";
}

const positionClasses: Record<DebugPanelProps["position"], string> = {
  "top-left": "top-0 start-0",
  "top-right": "top-0 end-0",
  "bottom-left": "bottom-0 start-0",
  "bottom-right": "bottom-0 end-0",
} as const;

const themeClasses: Record<NonNullable<DebugPanelProps["theme"]>, string> = {
  dark: "bg-black bg-opacity-70 text-white",
  light: "bg-white bg-opacity-70 text-black",
} as const;

export const DebugPanel: React.FC<DebugPanelProps> = ({
  data,
  title = "Debug Info",
  position = "top-right",
  theme = "dark",
}) => {
  const formatValue = (value: DebugData[keyof DebugData]): string => {
    if (typeof value === "number") {
      return Math.round(value * 100) / 100 + "";
    }
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }
    return String(value);
  };

  return (
    <div
      className={`position-absolute p-3 fs-6 ${positionClasses[position]} ${themeClasses[theme]}`}
      style={{
        minWidth: "200px",
        maxWidth: "300px",
        borderRadius: "4px",
        zIndex: 1000,
      }}
    >
      <h6 className="mb-2 border-bottom pb-1">{title}</h6>
      <div className="d-flex flex-column gap-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="d-flex justify-content-between">
            <span className="text-opacity-75">{key}:</span>
            <span className="ms-2">{formatValue(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

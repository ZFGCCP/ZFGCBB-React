import type React from "react";

interface BBGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: number;
  gap?: string;
}

const BBGrid: React.FC<BBGridProps> = ({
  children,
  className = "",
  columns = 12,
  gap = "gap-4",
}) => {
  const gridCols =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
    }[columns] || "grid-cols-12";

  return (
    <div className={`grid ${gridCols} ${gap} ${className}`}>{children}</div>
  );
};

export default BBGrid;

import type React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../../providers/theme/themeProvider";

import "./bbTable.component.css";

const BBTable: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <div className={`my-0 w-full ${className || ""} overflow-x-auto`}>
      <table
        className="w-full border-collapse"
        style={{
          // Using the CSS variables approach
          ["--th-bg" as any]: currentTheme.widgetColor,
          ["--td-color" as any]: currentTheme.textColor,
          ["--tr-odd-bg" as any]: currentTheme.tableRowAlt,
          ["--tr-even-bg" as any]: currentTheme.tableRow,
        }}
      >
        {children}
      </table>
    </div>
  );
};

export default BBTable;

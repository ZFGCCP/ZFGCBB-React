import type React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../../providers/theme/themeProvider";

const Widget: React.FC<{
  widgetTitle?: String;
  className?: String;
  children: React.ReactNode;
}> = ({ widgetTitle, className = "", children }) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <section
      className={`${className}`}
      style={{
        backgroundColor: currentTheme.headerColor,
        border: `${currentTheme.borderWidth} solid black`,
      }}
    >
      {widgetTitle && (
        <h6
          className="p-1 m-0 font-bold"
          style={{
            borderBottom: `${currentTheme.borderWidth} solid black`,
          }}
        >
          {widgetTitle}
        </h6>
      )}
      <div>{children}</div>
    </section>
  );
};

export default Widget;

import type React from "react";
import { useContext } from "react";
import { styled } from "@linaria/react";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import { useContext } from "react";
import { Theme } from "../../../types/theme";

const Style = {
  widgetMain: styled.div<{ theme: Theme }>`
    background-color: ${(props) => props.theme.widgetColor};
    border: 0.2rem solid black;
    height: 100% .widget-title {
      border-bottom: 0.2rem solid black;
    }
  `,
};

const Widget: React.FC<{
  widgetTitle: String;
  className?: String;
  children: React.ReactNode;
}> = ({ widgetTitle, className = "", children }) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <Style.widgetMain className={`${className}`} theme={currentTheme}>
      <div className="p-1 widget-title">{widgetTitle}</div>
      <div>{children}</div>
    </Style.widgetMain>
  );
};

export default Widget;

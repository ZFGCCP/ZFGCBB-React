import type React from "react";
import { useContext } from "react";
import { styled } from "styled-components";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import type { Theme } from "../../../types/theme";

const Style = {
  widgetMain: styled.section<{ theme: Theme }>`
    background-color: ${(props) => props.theme.headerColor};
    border: ${(props) => props.theme.borderWidth} solid black;

    .widget-title {
      border-bottom: ${(props) => props.theme.borderWidth} solid black;
      font-weight: bold;
    }
  `,
};

const Widget: React.FC<{
  widgetTitle?: String;
  className?: String;
  children: React.ReactNode;
}> = ({ widgetTitle, className = "", children }) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <Style.widgetMain className={`${className}`} theme={currentTheme}>
      {widgetTitle && <h6 className="p-1 m-0 widget-title">{widgetTitle}</h6>}
      <div>{children}</div>
    </Style.widgetMain>
  );
};

export default Widget;

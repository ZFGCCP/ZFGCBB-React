import type React from "react";
import { useContext } from "react";
import { styled } from "@pigment-css/react";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import type { Theme } from "../../../types/theme";

const Style = {
  widgetMain: styled("div")<{ theme: Theme }>({
    backgroundColor: (props) => props.theme.widgetColor,
    border: (props) => props.theme.borderWidth + " solid " + props.theme.black,

    ".widget-title": {
      borderBottom: (props) =>
        props.theme.borderWidth + " solid " + props.theme.black,
      fontWeight: "bold",
    },
  }),
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

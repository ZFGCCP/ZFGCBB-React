import { styled } from "@pigment-css/react";
import type React from "react";
import { useContext } from "react";
import { Link, type RelativeRoutingType } from "react-router";
import type { Theme } from "../../types/theme";
import { ThemeContext } from "../../providers/theme/themeProvider";

const Style = {
  link: styled("span")<{ theme: Theme }>({
    a: {
      color: (props) => props.theme.linkColorVisited,
      "&:visited": {
        color: (props) => props.theme.linkColorVisited,
      },
    },
  }),
};

const BBLink: React.FC<{
  to: string;
  children: React.ReactNode;
  relative?: RelativeRoutingType | undefined;
}> = ({ to, children, relative }) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <Style.link theme={currentTheme}>
      <Link to={to} relative={relative}>
        {children}
      </Link>
    </Style.link>
  );
};

export default BBLink;

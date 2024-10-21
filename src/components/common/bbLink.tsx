import { styled } from "@linaria/react";
import React, { useContext } from "react";
import { Link, RelativeRoutingType } from "react-router-dom";
import { Theme } from "../../types/theme";
import { ThemeContext } from "../../providers/theme/themeProvider";

const Style = {
  link: styled.span<{ theme: Theme }>`
    a {
      &:visited {
        color: ${(props) => props.theme.linkColorVisited};
      }

      &:link {
        color: ${(props) => props.theme.linkColorVisited};
      }
    }
  `,
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

import { styled } from "styled-components";
import type React from "react";
import { useContext } from "react";
import { Link, type RelativeRoutingType } from "react-router";
import type { Theme } from "../../types/theme";
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

import { styled } from "styled-components";
import type React from "react";
import { useContext } from "react";
import { Link, type LinkProps, type Register } from "react-router";
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

export type RouteParams = Register["params"];

type ReplaceParamsWithString<T extends string> =
  T extends `${infer Start}:${infer Param}/${infer Rest}` // Recursively process segments with dynamic parts
    ? `${Start}:${Param}/${ReplaceParamsWithString<Rest>}` // Replace dynamic part and recurse into the rest
    : T extends `${infer Start}:${infer Param}` // Handle the last dynamic part (e.g., `/forum/:boardId`)
      ? `${Start}:${Param}` // Replace the dynamic segment with string
      : T | (string & {}); // Return the path as is if no dynamic segments

type RouteKeys = Exclude<keyof RouteParams, "/*">;
type RoutePaths = ReplaceParamsWithString<RouteKeys>;
export type BBLinkProps = Omit<LinkProps, "to"> & {
  to: RoutePaths;
};
/**
 * This component is a wrapper around the <Link> component that provides
 * a styled link component with the current theme applied.
 * It also supports dynamic routes, e.g., `/forum/:boardId`.
 *
 * Usage:
 * ```tsx
 * <BBLink to="/forum/board/19/1">Forum</BBLink>
 * ```
 */
const BBLink: React.FC<BBLinkProps> = (props) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <Style.link theme={currentTheme}>
      <Link {...props} />
    </Style.link>
  );
};

export default BBLink;

import type React from "react";
import { useContext } from "react";
import { Link, type LinkProps, type Register } from "react-router";
import { ThemeContext } from "../../providers/theme/themeProvider";

/**
 * React-Router generates a type for the routes, so we alias {@link Register} to
 * make it easier to use.
 */
export type RouteParams = Register["params"];

type ReplaceParamsWithString<T extends string> =
  T extends `${infer Start}:${infer Param}/${infer Rest}`
    ? `${Start}:${Param}/${ReplaceParamsWithString<Rest>}`
    : T extends `${infer Start}:${infer Param}`
      ? `${Start}:${Param}`
      : T | (string & {});

type RouteKeys = Exclude<keyof RouteParams, "/*">;
export type RoutePaths = ReplaceParamsWithString<RouteKeys>;

export type BBLinkProps = Omit<LinkProps, "to"> & {
  to: RoutePaths | `${string}://${string}/${string}`;
};

/**
 * A theme-aware link component using Tailwind classes.
 */
const BBLink: React.FC<BBLinkProps> = (props) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <Link
      {...props}
      className="visited:[color:inherit] hover:underline"
      style={{
        color: currentTheme.linkColorVisited, // Custom theme color from context
      }}
    />
  );
};

export default BBLink;

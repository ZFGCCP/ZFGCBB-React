import type { User } from "../../types/user";

export const DEFAULT_THEME = "midnight";

const THEME_SMILEY_DEFAULTS = {
  sheik: "takam",
} as const;

function hasThemeSmileyDefault(
  theme: string,
): theme is keyof typeof THEME_SMILEY_DEFAULTS {
  return Object.hasOwn(THEME_SMILEY_DEFAULTS, theme);
}

export function userUiPrefs(user?: User) {
  return {
    userId: user?.id ?? 0,
    theme: user?.settings?.theme?.toLowerCase() ?? DEFAULT_THEME,
    smileySet: user?.settings?.smileySet ?? "",
  };
}

export function useTheme(userTheme?: string, userSmileySet?: string | null) {
  const [theme, setTheme] = useState(userTheme ?? DEFAULT_THEME);
  const [smileySet, setSmileySet] = useState(userSmileySet ?? "");
  const effectiveSmileySet =
    smileySet === "NONE"
      ? undefined
      : smileySet
        ? smileySet.toLowerCase()
        : hasThemeSmileyDefault(theme)
          ? THEME_SMILEY_DEFAULTS[theme]
          : "tplink";
  return { theme, setTheme, smileySet, setSmileySet, effectiveSmileySet };
}

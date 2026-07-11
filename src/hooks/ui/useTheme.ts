import type { User } from "../../types/user";

export const DEFAULT_THEME = "midnight";

const THEME_SMILEY_DEFAULTS = {
  sheik: "takam",
} as const;

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
        : theme in THEME_SMILEY_DEFAULTS
          ? THEME_SMILEY_DEFAULTS[theme as keyof typeof THEME_SMILEY_DEFAULTS]
          : "tplink";
  return { theme, setTheme, smileySet, setSmileySet, effectiveSmileySet };
}

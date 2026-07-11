import { UserContext } from "@/providers/user/userProvider";

const THEME_OPTIONS = ["Midnight", "Kikori", "Goron", "Sheik"];

const SMILEY_SET_OPTIONS = [
  { value: "", label: "Theme default" },
  { value: "TPLINK", label: "TP Link" },
  { value: "TAKAM", label: "TakaM" },
  { value: "CLASSIC", label: "Classic" },
  { value: "NONE", label: "None" },
];

interface ThemePickerProps {
  theme: string;
  setTheme: (theme: string) => void;
  smileySet: string;
  setSmileySet: (smileySet: string) => void;
}

export default function ThemePicker({
  theme,
  setTheme,
  smileySet,
  setSmileySet,
}: ThemePickerProps) {
  const user = useContext(UserContext);

  const persist = (nextTheme: string, nextSmileySet: string) => {
    if (!user.id) return;
    void apiFetch(`${getApiBaseUrl()}/user-profile/${user.id}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme: nextTheme.toUpperCase(),
        smileySet: nextSmileySet || null,
      }),
    }).catch(() => {});
  };

  return (
    <div className="z-50 p-1 bg-elevated border-t border-default">
      <div className="flex gap-2 items-center">
        <label htmlFor="theme-selector" className="text-dimmed">
          Theme:
        </label>
        <select
          id="theme-selector"
          className="bg-default border border-default rounded-md p-1 capitalize"
          value={theme}
          onChange={(event) => {
            setTheme(event.target.value);
            persist(event.target.value, smileySet);
          }}
        >
          {THEME_OPTIONS.map((name) => (
            <option
              key={name}
              className="capitalize"
              value={name.toLowerCase()}
            >
              {name}
            </option>
          ))}
        </select>
        <label htmlFor="smiley-set-selector" className="text-dimmed">
          Smileys:
        </label>
        <select
          id="smiley-set-selector"
          className="bg-default border border-default rounded-md p-1"
          value={smileySet}
          onChange={(event) => {
            setSmileySet(event.target.value);
            persist(theme, event.target.value);
          }}
        >
          {SMILEY_SET_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

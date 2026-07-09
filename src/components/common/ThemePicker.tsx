const THEME_OPTIONS = ["Midnight", "Kikori", "Goron", "Sheik"];

interface ThemePickerProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export default function ThemePicker({ theme, setTheme }: ThemePickerProps) {
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
          onChange={(event) => setTheme(event.target.value)}
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
      </div>
    </div>
  );
}

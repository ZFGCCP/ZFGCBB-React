import type React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import type { Theme } from "../../../types/theme";

export type FooterConfig = {
  label: String;
  callback: () => void;
};

const FooterButtons: React.FC<{ options: FooterConfig[] }> = ({ options }) => {
  const { currentTheme } = useContext(ThemeContext);

  // Get border width from theme for dynamic styles
  const borderWidth = currentTheme?.borderWidth || "0.2rem";

  return (
    <div className="flex justify-end">
      {options.map((opt, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <button
            key={`${opt.label}`}
            onClick={() => opt.callback()}
            className={`
              px-2 
              bg-[#25334e] 
              border-black
              border-l
              border-b
              rounded-none
              border-solid
              ${isFirst ? "rounded-bl-lg" : ""}
              ${isLast ? "rounded-br-lg border-r" : ""}
            `}
            style={{
              borderWidth: isLast
                ? borderWidth
                : "0 0 " + borderWidth + " " + borderWidth,
              borderTopWidth: 0,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default FooterButtons;

import type React from "react";
import { useContext } from "react";
import { styled } from "@pigment-css/react";
import { Button } from "react-bootstrap";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import type { Theme } from "../../../types/theme";

const Style = {
  FooterButton: styled(Button)<{ theme: Theme }>({
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
    backgroundColor: (props) => props.theme.black,
    border: (props) => props.theme.borderWidth + " solid " + props.theme.black,
    borderTop: "0",
    borderBottomRightRadius: "0",
    borderBottomLeftRadius: "0",
    borderRight: "0",

    "&:first-child": {
      borderBottomLeftRadius: "0.5rem",
    },

    "&:last-child": {
      borderBottomRightRadius: "0.5rem",
      borderRight: "0.2rem solid black",
    },
  }),
};

export type FooterConfig = {
  label: String;
  callback: () => void;
};

const FooterButtons: React.FC<{ options: FooterConfig[] }> = ({ options }) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <div className="d-flex justify-content-end">
      {options.map((opt) => {
        return (
          <Style.FooterButton
            onClick={() => opt.callback()}
            className="footer-btn px-2"
            theme={currentTheme}
          >
            {opt.label}
          </Style.FooterButton>
        );
      })}
    </div>
  );
};

export default FooterButtons;

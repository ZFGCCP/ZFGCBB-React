import React, { useContext } from "react";
import { styled } from "@linaria/react";
import { Button } from "react-bootstrap";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import { Theme } from "../../../types/theme";
const Style = {
  FooterButton: styled(Button)<{ theme: Theme }>`
    &.footer-btn {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      background-color: #25334e;
      border: ${(props) => props.theme.borderWidth} solid
        ${(props) => props.theme.black};
      border-top: 0;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      border-right: 0;

      &:first-child {
        border-bottom-left-radius: 0.5rem;
      }

      &:last-child {
        border-bottom-right-radius: 0.5rem;
        border-right: 0.2rem solid black;
      }
    }
  `,
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

import React from "react";
import { styled } from "@linaria/react";
import { Button } from "react-bootstrap";

const Style = {
  FooterButton: styled(Button)`
    &.footer-btn {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      background-color: #25334e;
      border-top: 0;
      border: 0.2rem solid black;
      padding-right: 0.2rem;
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
  return (
    <div className="d-flex justify-content-end">
      {options.map((opt) => {
        return (
          <Style.FooterButton
            onClick={() => opt.callback()}
            className="footer-btn"
          >
            {opt.label}
          </Style.FooterButton>
        );
      })}
    </div>
  );
};

export default FooterButtons;

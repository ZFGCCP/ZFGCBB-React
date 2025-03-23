import type React from "react";
import { useContext } from "react";
import Widget from "../components/common/widgets/widget.component";
import { styled } from "styled-components";
import type { Theme } from "../types/theme";
import { ThemeContext } from "../providers/theme/themeProvider";

const Style = {
  accordionWrapper: styled.div`
    margin: 2rem;
  `,

  accordionHeader: styled.div<{ theme: Theme }>`
    background-color: ${(props) => props.theme.backgroundColor};
    border: ${(props) => props.theme.borderWidth} solid
      ${(props) => props.theme.black};
  `,
};

const UserRegistration: React.FC = () => {
  const { currentTheme } = useContext(ThemeContext);
  return (
    <div className="row">
      <div className="col-12 my-2">
        <Widget widgetTitle={"Registration"}>
          <div className="d-flex flex-column flex-md-row">
            <p>Please fill out the form below to register your account.</p>
          </div>
        </Widget>
      </div>
    </div>
  );
};

export default UserRegistration;

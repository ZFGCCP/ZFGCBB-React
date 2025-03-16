import type React from "react";
import { useContext } from "react";
import { Table } from "react-bootstrap";
import { styled } from "@pigment-css/react";
import type { Theme } from "../../../types/theme";
import { ThemeContext } from "../../../providers/theme/themeProvider";

const Style = {
  Table: styled(Table)<{ theme: Theme }>({
    th: {
      backgroundColor: (props) => props.theme.widgetColor,
      color: "white",
      border: "0",
    },

    tbody: {
      tr: {
        td: {
          color: (props) => props.theme.textColor,
          verticalAlign: "middle",
          border: "0",
        },

        "&:nth-child(odd)": {
          td: {
            backgroundColor: (props) => props.theme.tableRowAlt,
          },
        },

        "&:nth-child(even)": {
          td: {
            backgroundColor: (props) => props.theme.tableRow,
          },
        },
      },
    },
  }),
};

const BBTable: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <Style.Table className="my-0" striped hover responsive theme={currentTheme}>
      {children}
    </Style.Table>
  );
};

export default BBTable;

import type React from "react";
import { useContext } from "react";
import { Table } from "react-bootstrap";
import { styled } from "@linaria/react";
import type { Theme } from "../../../types/theme";
import { ThemeContext } from "../../../providers/theme/themeProvider";

const Style = {
  Table: styled(Table)<{ theme: Theme }>`
    th {
      background-color: ${(props) => props.theme.widgetColor};
      color: white;
      border: 0;
    }

    tbody {
      tr {
        td {
          color: ${(props) => props.theme.textColor};
          vertical-align: middle;
          border: 0;
        }

        &:nth-child(odd) {
          td {
            background-color: ${(props) => props.theme.tableRowAlt};
          }
        }

        &:nth-child(even) {
          td {
            background-color: ${(props) => props.theme.tableRow};
          }
        }
      }
    }
  `,
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

import { styled } from "@pigment-css/react";
import type React from "react";
import { useCallback, useContext, useMemo } from "react";
import { Pagination } from "react-bootstrap";
import type { Theme } from "../../../types/theme";
import { ThemeContext } from "../../../providers/theme/themeProvider";

const Style = {
  pagination: styled(Pagination)<{ theme: Theme }>({
    "&.pagination": {
      marginBottom: "0",
      "li.page-item": {
        "&:hover": {
          backgroundColor: (props) => props.theme.backgroundColor,
        },

        a: {
          border: "0",
        },
      },
    },
  }),
};

const BBPaginator: React.FC<{
  numPages: number;
  currentPage: number;
  onPageChange: (pageNo: number) => void;
}> = ({ numPages, currentPage, onPageChange }) => {
  const { currentTheme } = useContext(ThemeContext);
  const maxPages = 10;
  const maxToRender = useMemo(() => {
    return numPages <= maxPages ? numPages : maxPages;
  }, [numPages, maxPages]);

  const pages = useMemo(() => {
    const pages: React.JSX.Element[] = [];

    for (let i: number = 0; i < maxToRender; i++) {
      pages.push(
        <Pagination.Item
          onClick={() => {
            onPageChange(i + 1);
          }}
        >
          {i + 1}
        </Pagination.Item>,
      );
    }

    return pages;
  }, [numPages, currentPage, onPageChange]);

  const shiftPage = useCallback(
    (inc: number) => {
      onPageChange(currentPage + inc);
    },
    [currentPage, onPageChange],
  );

  return (
    <div className="d-flex flex-row align-items-center">
      <Style.pagination theme={currentTheme}>
        <Pagination.First
          onClick={() => {
            onPageChange(1);
          }}
        />
        {currentPage !== 1 && <Pagination.Prev onClick={() => shiftPage(-1)} />}
        {pages}
        {currentPage !== numPages && (
          <Pagination.Next onClick={() => shiftPage(1)} />
        )}
        <Pagination.Last
          onClick={() => {
            onPageChange(numPages);
          }}
        />
      </Style.pagination>
      <div>
        Page {currentPage} of {numPages}
      </div>
    </div>
  );
};

export default BBPaginator;

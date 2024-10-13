import { styled } from "@linaria/react";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { Pagination } from "react-bootstrap";
import { Theme } from "../../../types/theme";
import { ThemeContext } from "../../../providers/theme/themeProvider";

const Style = {
  pagination: styled(Pagination)<{ theme: Theme }>`
    &.pagination {
      margin-bottom: 0;

      li.page-item {
        &:hover {
          background-color: ${(props) => props.theme.backgroundColor};
        }

        a {
          border: 0;
        }
      }
    }
  `,
};

const BBPaginator: React.FC<{
  numPages: number;
  onPageChange: (pageNo: number) => void;
}> = ({ numPages, onPageChange }) => {
  const { currentTheme } = useContext(ThemeContext);
  const maxPages = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const maxToRender = useMemo(() => {
    return numPages <= maxPages ? numPages : maxPages;
  }, [numPages, maxPages]);

  const pages = useMemo(() => {
    const pages: React.JSX.Element[] = [];

    for (let i: number = 0; i < maxToRender; i++) {
      pages.push(
        <Pagination.Item
          onClick={() => {
            setCurrentPage(i + 1);
            onPageChange(i + 1);
          }}
        >
          {i + 1}
        </Pagination.Item>,
      );
    }

    return pages;
  }, [numPages, currentPage, setCurrentPage, onPageChange]);

  const shiftPage = useCallback(
    (inc: number) => {
      onPageChange(currentPage + inc);
      setCurrentPage((prev) => {
        return prev + inc;
      });
    },
    [currentPage, setCurrentPage, onPageChange],
  );

  return (
    <div className="d-flex flex-row align-items-center">
      <Style.pagination theme={currentTheme}>
        <Pagination.First
          onClick={() => {
            setCurrentPage(1);
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
            setCurrentPage(numPages);
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

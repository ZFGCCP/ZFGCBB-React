import { styled } from "styled-components";
import type React from "react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pagination } from "react-bootstrap";
import type { Theme } from "../../../types/theme";
import { ThemeContext } from "../../../providers/theme/themeProvider";

const Styled = {
  pagination: styled(Pagination)<{ theme: Theme }>`
  &.pagination {
    margin-bottom: 0;
    display: flex;
    gap: 0.25rem;

    li.page-item {
      scroll-snap-align: start;

      &:last-child {
        scroll-snap-align: end;
      }

      &:hover {
        background-color: ${(props) => props.theme.backgroundColor};
      }

      a {
        border: 0;
      }

      &
    }
  }
`,
  scrollWrapper: styled.div`
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    width: 100%;
  `,
};

export type BBPaginatorProps = {
  numPages: number;
  currentPage: number;
  maxPageCount?: number;
  onPageChange: (pageNo: number) => void;
};

const BBPaginator: React.FC<BBPaginatorProps> = ({
  numPages,
  currentPage,
  onPageChange,
  maxPageCount,
}) => {
  const { currentTheme } = useContext(ThemeContext);

  const [maxPages, setMaxPageCount] = useState(
    window.innerWidth < 768 ? 4 : (maxPageCount ?? 10),
  );

  useEffect(() => {
    let debounceTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        setMaxPageCount(window.innerWidth < 768 ? 4 : (maxPageCount ?? 10));
      }, 250); // 200ms debounce delay
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(debounceTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [maxPageCount]);

  const maxToRender = useMemo(() => {
    return numPages <= maxPages ? numPages : maxPages;
  }, [numPages, maxPages]);

  const pages = useMemo(() => {
    const pages: React.JSX.Element[] = [];

    // Handle edge case when there are fewer pages than maxPages
    const startPage = Math.max(currentPage - Math.floor(maxToRender / 2), 1);
    const endPage = Math.min(startPage + maxToRender - 1, numPages ?? 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={currentPage === i}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>,
      );
    }

    // If there are more pages than we can show, add ellipsis
    if (startPage > 1 && numPages > maxToRender) {
      pages.unshift(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }
    if (endPage < numPages) {
      pages.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    }

    return pages;
  }, [numPages, currentPage, onPageChange, maxPages]);

  const shiftPage = useCallback(
    (inc: number) => {
      onPageChange(currentPage + inc);
    },
    [currentPage, onPageChange],
  );

  return (
    <Styled.scrollWrapper>
      <Styled.pagination theme={currentTheme}>
        <Pagination.First onClick={() => onPageChange(1)} />
        {currentPage !== 1 && <Pagination.Prev onClick={() => shiftPage(-1)} />}
        {pages}
        {currentPage !== numPages && (
          <Pagination.Next onClick={() => shiftPage(1)} />
        )}
        <Pagination.Last onClick={() => onPageChange(numPages)} />
      </Styled.pagination>
      <div>
        Page {currentPage} of {numPages}
      </div>
    </Styled.scrollWrapper>
  );
};

export default BBPaginator;

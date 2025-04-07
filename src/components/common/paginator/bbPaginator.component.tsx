import type React from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../../../providers/theme/themeProvider";

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
      }, 250); // 250ms debounce delay
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
        <li key={i} className="scroll-snap-start">
          <button
            className={`flex items-center justify-center w-8 h-8 mx-1 rounded-md ${
              currentPage === i
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        </li>,
      );
    }

    // If there are more pages than we can show, add ellipsis
    if (startPage > 1 && numPages > maxToRender) {
      pages.unshift(
        <li key="start-ellipsis" className="scroll-snap-start">
          <span className="flex items-center justify-center w-8 h-8 mx-1">
            ...
          </span>
        </li>,
      );
    }
    if (endPage < numPages) {
      pages.push(
        <li key="end-ellipsis" className="scroll-snap-start">
          <span className="flex items-center justify-center w-8 h-8 mx-1">
            ...
          </span>
        </li>,
      );
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
    <div className="overflow-x-auto scroll-snap-x-mandatory w-full">
      <ul className="flex items-center mb-0 gap-1 p-0 list-none">
        <li className="scroll-snap-start">
          <button
            className="flex items-center justify-center w-8 h-8 rounded-md bg-white text-gray-700 hover:bg-gray-100"
            onClick={() => onPageChange(1)}
          >
            ⟪
          </button>
        </li>
        {currentPage !== 1 && (
          <li>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-md bg-white text-gray-700 hover:bg-gray-100"
              onClick={() => shiftPage(-1)}
            >
              ⟨
            </button>
          </li>
        )}
        {pages}
        {currentPage !== numPages && (
          <li>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-md bg-white text-gray-700 hover:bg-gray-100"
              onClick={() => shiftPage(1)}
            >
              ⟩
            </button>
          </li>
        )}
        <li className="scroll-snap-end">
          <button
            className="flex items-center justify-center w-8 h-8 rounded-md bg-white text-gray-700 hover:bg-gray-100"
            onClick={() => onPageChange(numPages)}
          >
            ⟫
          </button>
        </li>
      </ul>
      <div className="mt-2">
        Page {currentPage} of {numPages}
      </div>
    </div>
  );
};

export default BBPaginator;

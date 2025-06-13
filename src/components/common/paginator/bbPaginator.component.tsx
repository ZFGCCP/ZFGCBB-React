import type React from "react";
import { useCallback, useMemo } from "react";

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
  const maxPages = maxPageCount ?? 5;

  const pages = useMemo(() => {
    const pageElements: React.JSX.Element[] = [];

    const startPage = Math.max(currentPage - Math.floor(maxPages / 2), 1);
    const endPage = Math.min(startPage + maxPages - 1, numPages ?? 1);

    for (let i = startPage; i <= endPage; i++) {
      pageElements.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`
            px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
            ${
              currentPage === i
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }
          `}
        >
          {i}
        </button>,
      );
    }

    // Add ellipsis for truncated pages
    if (startPage > 1 && numPages > maxPages) {
      pageElements.unshift(
        <span key="start-ellipsis" className="px-3 py-2 text-sm text-gray-500">
          ...
        </span>,
      );
    }
    if (endPage < numPages) {
      pageElements.push(
        <span key="end-ellipsis" className="px-3 py-2 text-sm text-gray-500">
          ...
        </span>,
      );
    }

    return pageElements;
  }, [numPages, currentPage, onPageChange, maxPages]);

  const shiftPage = useCallback(
    (inc: number) => {
      onPageChange(currentPage + inc);
    },
    [currentPage, onPageChange],
  );

  const buttonClass =
    "px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="overflow-x-auto scroll-smooth w-full">
      <div
        className="flex gap-1 mb-0"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={buttonClass}
          style={{ scrollSnapAlign: "start" }}
        >
          First
        </button>

        {currentPage !== 1 && (
          <button onClick={() => shiftPage(-1)} className={buttonClass}>
            Prev
          </button>
        )}

        {pages}

        {currentPage !== numPages && (
          <button onClick={() => shiftPage(1)} className={buttonClass}>
            Next
          </button>
        )}

        <button
          onClick={() => onPageChange(numPages)}
          disabled={currentPage === numPages}
          className={buttonClass}
          style={{ scrollSnapAlign: "end" }}
        >
          Last
        </button>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        Page {currentPage} of {numPages}
      </div>
    </div>
  );
};

export default BBPaginator;

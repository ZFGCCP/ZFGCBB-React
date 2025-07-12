import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const maxPages = maxPageCount ?? 10;

  const maxToRender = useMemo(() => {
    return numPages <= maxPages ? numPages : maxPages;
  }, [numPages, maxPages]);

  const pages = useMemo(() => {
    const pages: React.JSX.Element[] = [];

    const startPage = Math.max(currentPage - Math.floor(maxToRender / 2), 1);
    const endPage = Math.min(startPage + maxToRender - 1, numPages ?? 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-2 text-sm border border-default ${
            currentPage === i
              ? "bg-elevated text-highlighted"
              : "bg-muted  hover:bg-elevated"
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>,
      );
    }

    if (startPage > 1 && numPages > maxToRender) {
      pages.unshift(
        <span key="start-ellipsis" className="px-3 py-2 text-muted">
          ...
        </span>,
      );
    }
    if (endPage < numPages) {
      pages.push(
        <span key="end-ellipsis" className="px-3 py-2 text-muted">
          ...
        </span>,
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
    <div className="overflow-x-auto scroll-smooth w-full">
      <div className="flex gap-1 mb-0">
        <button
          className="px-3 py-2 text-sm border border-default bg-muted  hover:bg-elevated"
          onClick={() => onPageChange(1)}
        >
          First
        </button>
        {currentPage !== 1 && (
          <button
            className="px-3 py-2 text-sm border border-default bg-muted  hover:bg-elevated"
            onClick={() => shiftPage(-1)}
          >
            Prev
          </button>
        )}
        {pages}
        {currentPage !== numPages && (
          <button
            className="px-3 py-2 text-sm border border-default bg-muted  hover:bg-elevated"
            onClick={() => shiftPage(1)}
          >
            Next
          </button>
        )}
        <button
          className="px-3 py-2 text-sm border border-default bg-muted  hover:bg-elevated"
          onClick={() => onPageChange(numPages)}
        >
          Last
        </button>
      </div>
      <div className="text-sm text-muted mt-2">
        Page {currentPage} of {numPages}
      </div>
    </div>
  );
};

export default BBPaginator;

import type { BBFlexProps } from "./BBFlex";

export interface BBTableColumn<T> {
  key: keyof T | string;
  label: string;
  className?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
}

// oxlint-disable-next-line no-unused-vars
export interface BBTableProps<T> {
  columns: BBTableColumn<T>[];
  data: T[];
  className?: string;
  headerClassName?: string;
  headerOuterFlexOptions?: Omit<BBFlexProps, "children">;
  rowClassName?: string | ((row: T, index: number) => string);
  rowOuterFlexOptions?: Omit<BBFlexProps, "children">;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  showHeader?: boolean;
}

const EMPTY_FLEX_OPTIONS: Omit<BBFlexProps, "children"> = {};

function getColumnVisibilityClass<T>(column: BBTableColumn<T>): string {
  let classes = "";
  if (column.hideOnMobile) classes += "hidden sm:block ";
  if (column.hideOnTablet) classes += "hidden md:block ";
  return classes.trim();
}

export default function BBTable<T extends object>({
  columns,
  data,
  className = "",
  headerClassName = "",
  headerOuterFlexOptions = EMPTY_FLEX_OPTIONS,
  rowClassName = "",
  rowOuterFlexOptions = EMPTY_FLEX_OPTIONS,
  onRowClick,
  emptyMessage = "No data available",
  showHeader = true,
}: BBTableProps<T>) {
  const getRowClassName = (row: T, index: number): string => {
    const baseClass = "transition-colors";
    const stripeClass =
      index % 2 === 0
        ? "bg-muted hover:bg-muted/60"
        : "bg-elevated hover:bg-elevated/40";
    const customClass =
      typeof rowClassName === "function"
        ? rowClassName(row, index)
        : rowClassName;
    const clickableClass = onRowClick ? "cursor-pointer" : "";

    return `${baseClass} ${stripeClass} ${customClass} ${clickableClass}`.trim();
  };

  return (
    <div className={`border border-default ${className}`}>
      {showHeader && (
        <div
          className={`bg-elevated border-b-2 border-default ${headerClassName}`}
        >
          <BBFlex
            className="p-4 font-semibold"
            align="center"
            justify="center"
            {...headerOuterFlexOptions}
          >
            {columns.map((column) => (
              <div
                key={String(column.key)}
                className={`${column.className || ""} ${getColumnVisibilityClass(column)}`}
              >
                {column.label}
              </div>
            ))}
          </BBFlex>
        </div>
      )}

      <div className="divide-y divide-default">
        {data.length === 0 ? (
          <div className="p-8 text-center bg-muted">{emptyMessage}</div>
        ) : (
          data.map((row, index) => {
            const rowKey = String(
              (row as { [key: string]: unknown }).id ?? index,
            );
            const rowContent = (
              <BBFlex align="center" justify="center" {...rowOuterFlexOptions}>
                {columns.map((column) => (
                  <div
                    key={String(column.key)}
                    className={`${column.className || ""} ${getColumnVisibilityClass(column)}`}
                  >
                    {column.render
                      ? column.render(row[column.key as keyof T], row, index)
                      : String(row[column.key as keyof T] || "")}
                  </div>
                ))}
              </BBFlex>
            );

            if (!onRowClick) {
              return (
                <div key={rowKey} className={getRowClassName(row, index)}>
                  {rowContent}
                </div>
              );
            }

            return (
              <div
                key={rowKey}
                className={getRowClassName(row, index)}
                role="button"
                tabIndex={0}
                onClick={() => onRowClick(row, index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRowClick(row, index);
                  }
                }}
              >
                {rowContent}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

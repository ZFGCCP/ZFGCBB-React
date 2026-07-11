import type { BBFlexProps } from "./BBFlex";

export interface BBTableColumn<TRow> {
  key: keyof TRow | string;
  label: string;
  className?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  render?: (
    value: TRow[keyof TRow],
    row: TRow,
    index: number,
  ) => React.ReactNode;
}

// oxlint-disable-next-line no-unused-vars
export interface BBTableProps<TRow> {
  columns: BBTableColumn<TRow>[];
  data: TRow[];
  className?: string;
  headerClassName?: string;
  headerOuterFlexOptions?: Omit<BBFlexProps, "children">;
  rowClassName?: string | ((row: TRow, index: number) => string);
  rowOuterFlexOptions?: Omit<BBFlexProps, "children">;
  getRowKey: (row: TRow) => React.Key;
  onRowClick?: (row: TRow, index: number) => void;
  emptyMessage?: string;
  showHeader?: boolean;
}

const EMPTY_FLEX_OPTIONS: Omit<BBFlexProps, "children"> = {};

function getColumnVisibilityClass<TRow>(column: BBTableColumn<TRow>): string {
  let classes = "";
  if (column.hideOnMobile) classes += "hidden sm:block ";
  if (column.hideOnTablet) classes += "hidden md:block ";
  return classes.trim();
}

export default function BBTable<TRow extends object>({
  columns,
  data,
  className = "",
  headerClassName = "",
  headerOuterFlexOptions = EMPTY_FLEX_OPTIONS,
  rowClassName = "",
  rowOuterFlexOptions = EMPTY_FLEX_OPTIONS,
  getRowKey,
  onRowClick,
  emptyMessage = "No data available",
  showHeader = true,
}: BBTableProps<TRow>) {
  const getRowClassName = (row: TRow, index: number): string => {
    const baseClass = "transition-colors px-4";
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
            gap={rowOuterFlexOptions.gap}
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
            const rowKey = getRowKey(row);
            const rowContent = (
              <BBFlex align="center" justify="center" {...rowOuterFlexOptions}>
                {columns.map((column) => (
                  <div
                    key={String(column.key)}
                    className={`${column.className || ""} ${getColumnVisibilityClass(column)}`}
                  >
                    {column.render
                      ? column.render(row[column.key as keyof TRow], row, index)
                      : String(row[column.key as keyof TRow] || "")}
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
              <button
                type="button"
                key={rowKey}
                className={`${getRowClassName(row, index)} block w-full text-left`}
                onClick={() => onRowClick(row, index)}
              >
                {rowContent}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

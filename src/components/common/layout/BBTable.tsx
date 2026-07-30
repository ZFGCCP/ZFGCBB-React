import type { BBFlexProps } from "./BBFlex";

export interface BBTableColumn<TRow> {
  key: keyof TRow | string;
  label: string;
  className?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  render?: (value: unknown, row: TRow, index: number) => React.ReactNode;
}

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

function getColumnValue<TRow extends object>(
  row: TRow,
  column: BBTableColumn<TRow>,
): unknown {
  return isRowKey(row, column.key) ? row[column.key] : undefined;
}

function isRowKey<TRow extends object>(
  row: TRow,
  key: PropertyKey,
): key is keyof TRow {
  return key in row;
}

function displayColumnValue(value: unknown): string {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  return "";
}

function getRowClassName<TRow>(
  row: TRow,
  index: number,
  rowClassName: BBTableProps<TRow>["rowClassName"],
  clickable: boolean,
): string {
  const baseClass = "transition-colors px-4";
  const stripeClass =
    index % 2 === 0
      ? "bg-muted hover:bg-muted/60"
      : "bg-elevated hover:bg-elevated/40";
  const customClass =
    typeof rowClassName === "function"
      ? rowClassName(row, index)
      : rowClassName;
  const clickableClass = clickable ? "cursor-pointer" : "";

  return `${baseClass} ${stripeClass} ${customClass ?? ""} ${clickableClass}`.trim();
}

function BBTableDataRow<TRow extends object>({
  row,
  index,
  columns,
  rowClassName,
  rowOuterFlexOptions,
  onRowClick,
}: {
  row: TRow;
  index: number;
  columns: BBTableColumn<TRow>[];
  rowClassName: BBTableProps<TRow>["rowClassName"];
  rowOuterFlexOptions: Omit<BBFlexProps, "children">;
  onRowClick?: (row: TRow, index: number) => void;
}) {
  const handleClick = useCallback(
    () => onRowClick?.(row, index),
    [index, onRowClick, row],
  );
  const className = getRowClassName(
    row,
    index,
    rowClassName,
    onRowClick != null,
  );
  const rowContent = (
    <BBFlex align="center" justify="center" {...rowOuterFlexOptions}>
      {columns.map((column) => {
        const value = getColumnValue(row, column);
        return (
          <div
            key={String(column.key)}
            className={`${column.className || ""} ${getColumnVisibilityClass(column)}`}
          >
            {column.render
              ? column.render(value, row, index)
              : displayColumnValue(value)}
          </div>
        );
      })}
    </BBFlex>
  );

  if (!onRowClick) {
    return <div className={className}>{rowContent}</div>;
  }

  return (
    <button
      type="button"
      className={`${className} block w-full text-left`}
      onClick={handleClick}
    >
      {rowContent}
    </button>
  );
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
            return (
              <BBTableDataRow
                key={rowKey}
                row={row}
                index={index}
                columns={columns}
                rowClassName={rowClassName}
                rowOuterFlexOptions={rowOuterFlexOptions}
                onRowClick={onRowClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

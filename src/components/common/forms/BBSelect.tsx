type BBSelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  options: readonly { value: string | number; label: string }[];
};

export default function BBSelect({
  options,
  className,
  ...rest
}: BBSelectProps) {
  return (
    <select
      className={`w-full p-2 bg-default border ${className ?? "border-default"}`}
      {...rest}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

import type { BBLookup } from "../../../types/forum";

const BBSelect: React.FC<{
  disabled?: boolean;
  value: number | undefined;
  options: BBLookup[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}> = ({ disabled, value, options, onChange }) => {
  return (
    <select
      className="w-full p-2 bg-default border border-default flex-1/2"
      disabled={disabled || false}
      value={value}
      onChange={onChange}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default BBSelect;

import { type BBPaginatorProps } from "@/components/common/pagination/BBPaginator";

export default function PaginatorBar(
  props: Omit<BBPaginatorProps, "className">,
) {
  return (
    <div className="bg-accented p-4 scrollbar-thin">
      <BBPaginator {...props} />
    </div>
  );
}

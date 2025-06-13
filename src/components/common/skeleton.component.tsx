import type React from "react";

export default function Skeleton<
  PropsType extends React.HTMLAttributes<HTMLDivElement> &
    React.PropsWithChildren,
>(props: PropsType) {
  return (
    <div
      {...props}
      className={`inline-block size-max border rounded-lg animate-pulse`}
    ></div>
  );
}

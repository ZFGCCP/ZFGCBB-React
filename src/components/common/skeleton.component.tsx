import type React from "react";

export default function Skeleton<
  PropsType extends React.HTMLAttributes<HTMLDivElement> &
    React.PropsWithChildren,
>(props: PropsType) {
  return (
    <div
      {...props}
      className={`
        inline-block w-full h-full rounded-lg animate-pulse bg-gradient-to-r from-muted to-elevated
        ${props.className || ""}
      `}
    />
  );
}

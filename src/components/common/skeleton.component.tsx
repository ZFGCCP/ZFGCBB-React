import type React from "react";

export default function Skeleton<
  PropsType extends React.HTMLAttributes<HTMLDivElement> &
    React.PropsWithChildren,
>(props: PropsType) {
  return (
    <div
      className="inline-block w-max h-max max-w-full max-h-full rounded-lg animate-[skeleton-loading_1.4s_ease-in-out_infinite]"
      {...props}
    />
  );
}

// Add these keyframes to global CSS or tailwind.config.js
// @keyframes skeleton-loading {
//   0% {
//     background-color: rgba(0, 0, 0, 0.5);
//     opacity: 0;
//   }
//   100% {
//     background-color: rgba(255, 255, 255, 0.6);
//     opacity: 1;
//   }
// }

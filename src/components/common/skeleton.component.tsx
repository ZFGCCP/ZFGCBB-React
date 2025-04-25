import type React from "react";
import { styled } from "styled-components";

const SkeletonStyle = {
  skeleton: styled.div`
    display: inline-block;
    width: max-content;
    height: max-content;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0.5rem;
    animation: skeleton-loading 1.4s ease-in-out infinite;
    @keyframes skeleton-loading {
      0% {
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
      }
      100% {
        background-color: rgba(255, 255, 255, 0.6);
        opacity: 1;
      }
    }
  `,
};

export default function Skeleton<
  PropsType extends React.HTMLAttributes<HTMLDivElement> &
    React.PropsWithChildren,
>(props: PropsType) {
  return <SkeletonStyle.skeleton {...props} />;
}

import type React from "react";
import { styled } from "styled-components";

// We are going to make a skeleton component with a simple animation

const SkeletonStyle = {
  skeleton: styled.div`
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    animation: skeleton-loading 1.4s ease-in-out infinite;
    @keyframes skeleton-loading {
      0% {
        background-color: rgba(0, 0, 0, 0.1);
      }
      100% {
        background-color: rgba(255, 255, 255, 0.5);
      }
    }
  `,
};

export default function Skeleton() {
  return <SkeletonStyle.skeleton />;
}

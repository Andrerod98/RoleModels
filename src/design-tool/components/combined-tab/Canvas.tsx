/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-namespace */
import * as React from "react";
import styled from "@emotion/styled";
import { useColorMode } from "@chakra-ui/react";

export interface CanvasProps {
  color?: string;
  background?: string;
  children: JSX.Element;
}

namespace S {
  export const Container = styled.div<{ color: string; background: string }>`
    height: 100%;
    background-color: ${(p) => p.background};
    background-size: 50px 50px;
    display: flex;

    > * {
      height: 100%;
      min-height: 100%;
      width: 100%;
    }

    background-image: linear-gradient(
        0deg,
        transparent 24%,
        ${(p) => p.color} 25%,
        ${(p) => p.color} 26%,
        transparent 27%,
        transparent 74%,
        ${(p) => p.color} 75%,
        ${(p) => p.color} 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        ${(p) => p.color} 25%,
        ${(p) => p.color} 26%,
        transparent 27%,
        transparent 74%,
        ${(p) => p.color} 75%,
        ${(p) => p.color} 76%,
        transparent 77%,
        transparent
      );
  `;

  
}

export const Canvas = (props: CanvasProps) => {
  const { colorMode } = useColorMode();
  return (
    <>
      <S.Container
        background={colorMode === "light" ? "#D0D0D0" : "rgb(60, 60, 60)"}
        color={
          colorMode === "light"
            ? "rgba(0,0,0, 0.05)"
            : "rgba(255,255,255, 0.05)"
        }
      >
        {props.children}
      </S.Container>
    </>
  );
};
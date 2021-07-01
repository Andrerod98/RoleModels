/* eslint-disable react/prop-types */
import React from "react";
import { InkCanvasController } from ".";
import { Box } from "@chakra-ui/react";
import { InkCanvasUI } from "./InkCanvasModel";
import { useEffect } from "react";
/* const colorPickerColors: IColor[] = [
  { r: 253, g: 0, b: 12, a: 1 },
  { r: 134, g: 0, b: 56, a: 1 },
  { r: 253, g: 187, b: 48, a: 1 },
  { r: 255, g: 255, b: 81, a: 1 },
  { r: 0, g: 45, b: 98, a: 1 },
  { r: 255, g: 255, b: 255, a: 1 },
  { r: 246, g: 83, b: 20, a: 1 },
  { r: 0, g: 161, b: 241, a: 1 },
  { r: 124, g: 187, b: 0, a: 1 },
  { r: 8, g: 170, b: 51, a: 1 },
  { r: 0, g: 0, b: 0, a: 1 },
];*/

export function InkCanvasView({
  controller,
}: {
  controller: InkCanvasController;
}) {
  useEffect(() => {
    const { color, thickness } = controller.get() as InkCanvasUI;
    const canvas = document.getElementById("ink-canvas") as HTMLCanvasElement;
    controller.setInkCanvas(canvas);
    if (thickness) controller.setStroke(thickness);
    if (color) {
      //console.log(color);
      controller.setColor(color);
    }
    //controller.sizeCanvas(100, 100);

    /*window.addEventListener("resize", () => {
      controller.sizeCanvas();
    });*/
  });

  const component = controller.get() as InkCanvasUI;
  const { color, thickness, ...props } = component;

  return (
    <Box {...props}>
      <canvas id={"ink-canvas"} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
}

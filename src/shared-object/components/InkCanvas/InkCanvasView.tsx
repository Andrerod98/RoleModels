/* eslint-disable react/prop-types */
import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { InkCanvasController } from ".";
import { Box } from "@chakra-ui/react";
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

export class InkCanvasView extends UIComponentView {
  public componentDidMount() {
    const controller = this.props.controller as InkCanvasController;
    const canvas = document.getElementById("ink-canvas") as HTMLCanvasElement;
    controller.setInkCanvas(canvas);
    controller.sizeCanvas();
    controller.setStroke(20);

    window.addEventListener("resize", () => {
      controller.sizeCanvas();
    });
  }

  public render() {
    const controller = this.props.controller as InkCanvasController;
    return (
      <Box
        className={"ink-component-root"}
        w={controller.getWidth() + "px"}
        h={controller.getHeight() + "px"}
        bg={"transparent"}
        position={"absolute"}
        top={0}
        left={0}
      >
        <Box className={"ink-surface"}>
          <canvas id={"ink-canvas"} className={"ink-canvas"}></canvas>
        </Box>
      </Box>
    );
  }
}

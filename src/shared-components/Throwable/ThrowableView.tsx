import React from "react";
import { ThrowableUI } from ".";
import { ThrowableController } from "./ThrowableController";
import { UIComponentController } from "../UIComponent";
import { ThrowingBall } from "./ThrowBall";

export function ThrowableView({
  controller,
}: {
  controller: ThrowableController;
}) {
  const component = controller.get() as ThrowableUI;

  return (
    <ThrowingBall
      x={component.x}
      y={component.y}
      controller={controller}
      component={component}
    >
      {controller
        .getChildren()
        .map((component: UIComponentController) => component.generateWidget())}
    </ThrowingBall>
  );
}

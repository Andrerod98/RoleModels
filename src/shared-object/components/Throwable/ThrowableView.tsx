import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { ThrowableUI } from ".";
import { ThrowableController } from "./ThrowableController";
import { UIComponentController } from "../UIComponent";
import { ThrowingBall } from "./ThrowBall";

export class ThrowableView extends UIComponentView {
  render() {
    const controller = this.props.controller as ThrowableController;
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
          .map((component: UIComponentController) =>
            component.generateWidget()
          )}
      </ThrowingBall>
    );
  }
}

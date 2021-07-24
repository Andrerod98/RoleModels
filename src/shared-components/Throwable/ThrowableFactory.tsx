import React from "react";
import { CgDisplaySpacing } from "react-icons/cg";
import { ThrowableUI, ThrowableController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class ThrowableFactory extends UIComponentFactory {
  public get name() {
    return "throwable";
  }

  public get example() {
    return {
      id: "throwable-id",
      name: "throwable",
      value: "Button",
    };
  }

  public get icon() {
    return <CgDisplaySpacing />;
  }

  public generateComponent(
    component: ThrowableUI,
    parent?: UIComponentController
  ): ThrowableController {
    return new ThrowableController(component, this.factoriesManager, parent);
  }
}

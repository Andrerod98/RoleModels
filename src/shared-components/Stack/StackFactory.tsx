import React from "react";
import { CgDisplaySpacing } from "react-icons/cg";
import { StackUI, StackController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class StackFactory extends UIComponentFactory {
  public get name() {
    return "stack";
  }

  public get example() {
    return {
      id: "stack-id",
      name: "stack",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <CgDisplaySpacing />;
  }

  public generateComponent(
    component: StackUI,
    parent?: UIComponentController
  ): StackController {
    return new StackController(component, this.factoriesManager, parent);
  }
}

import React from "react";
import { CgDisplaySpacing } from "react-icons/cg";
import { SpacerController, SpacerUI } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class SpacerFactory extends UIComponentFactory {
  public get name() {
    return "spacer";
  }

  public get example() {
    return {
      id: "spacer",
      name: "spacer",
    };
  }

  public get icon() {
    return <CgDisplaySpacing />;
  }

  public generateComponent(
    component: SpacerUI,
    parent?: UIComponentController
  ): SpacerController {
    return new SpacerController(component, this.factoriesManager, parent);
  }
}

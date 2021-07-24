import React from "react";
import { RiLayoutRowLine } from "react-icons/ri";
import { FlexUI, FlexController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class FlexFactory extends UIComponentFactory {
  public get name() {
    return "flex";
  }

  public get example() {
    return {
      id: "flex-id",
      name: "flex",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <RiLayoutRowLine />;
  }

  public generateComponent(
    component: FlexUI,
    parent?: UIComponentController
  ): FlexController {
    return new FlexController(component, this.factoriesManager, parent);
  }
}

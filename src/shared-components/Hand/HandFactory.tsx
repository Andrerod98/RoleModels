import React from "react";
import { BiRectangle } from "react-icons/bi";
import { HandModel, HandController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class HandFactory extends UIComponentFactory {
  public get name() {
    return "hand";
  }

  public get example() {
    return {
      id: "hand-id",
      name: "hand",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

  public generateComponent(
    component: HandModel,
    parent?: UIComponentController
  ): HandController {
    return new HandController(component, this.factoriesManager, parent);
  }
}

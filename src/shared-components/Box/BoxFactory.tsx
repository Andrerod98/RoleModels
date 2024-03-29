import React from "react";
import { BiRectangle } from "react-icons/bi";
import { BoxUI, DrawingToolsController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class BoxFactory extends UIComponentFactory {
  public get name() {
    return "box";
  }

  public get example() {
    return {
      id: "box-id",
      name: "box",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

  public generateComponent(
    component: BoxUI,
    parent?: UIComponentController
  ): DrawingToolsController {
    return new DrawingToolsController(component, this.factoriesManager, parent);
  }
}

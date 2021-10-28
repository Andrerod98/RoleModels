import React from "react";
import { MdOutlineDraw } from "react-icons/md";
import { DrawingToolsModel, DrawingToolsController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class DrawingToolsFactory extends UIComponentFactory {
  public get name() {
    return "drawing-tools";
  }

  public get example() {
    return {
      id: "drawing-tools-id",
      name: "drawing-tools",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <MdOutlineDraw />;
  }

  public generateComponent(
    component: DrawingToolsModel,
    parent?: UIComponentController
  ): DrawingToolsController {
    return new DrawingToolsController(component, this.factoriesManager, parent);
  }
}

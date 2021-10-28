import React from "react";
import { MdOutlineDraw } from "react-icons/md";
import { BrushChart2Model, BrushChart2Controller } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class BrushChart2Factory extends UIComponentFactory {
  public get name() {
    return "brush-chart-2";
  }

  public get example() {
    return {
      id: "brush-chart-2-id",
      name: "brush-chart-2",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <MdOutlineDraw />;
  }

  public generateComponent(
    component: BrushChart2Model,
    parent?: UIComponentController
  ): BrushChart2Controller {
    return new BrushChart2Controller(component, this.factoriesManager, parent);
  }
}

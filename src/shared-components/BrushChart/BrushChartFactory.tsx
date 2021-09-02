import React from "react";
import { BiRectangle } from "react-icons/bi";
import { BrushChartModel, BrushChartController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class BrushChartFactory extends UIComponentFactory {
  public get name() {
    return "scatter-plot";
  }

  public get example() {
    return {
      id: "scatter-plot-id",
      name: "scatter-plot",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

  public generateComponent(
    component: BrushChartModel,
    parent?: UIComponentController
  ): BrushChartController {
    return new BrushChartController(component, this.factoriesManager, parent);
  }
}

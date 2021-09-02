import React from "react";
import { BiRectangle } from "react-icons/bi";
import { AreaChartModel, AreaChartController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class AreaChartFactory extends UIComponentFactory {
  public get name() {
    return "area-chart";
  }

  public get example() {
    return {
      id: "area-chart-id",
      name: "area-chart",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

  public generateComponent(
    component: AreaChartModel,
    parent?: UIComponentController
  ): AreaChartController {
    return new AreaChartController(component, this.factoriesManager, parent);
  }
}

import React from "react";
import { BiRectangle } from "react-icons/bi";
import { XYChartModel, XYChartController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class XYChartFactory extends UIComponentFactory {
  public get name() {
    return "xychart";
  }

  public get example() {
    return {
      id: "xychart-id",
      name: "xychart",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

  public generateComponent(
    component: XYChartModel,
    parent?: UIComponentController
  ): XYChartController {
    return new XYChartController(component, this.factoriesManager, parent);
  }
}

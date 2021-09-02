import React from "react";
import { BiRectangle } from "react-icons/bi";
import { StockDetailsModel, StockDetailsController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class StockDetailsFactory extends UIComponentFactory {
  public get name() {
    return "stock-details";
  }

  public get example() {
    return {
      id: "stock-details-id",
      name: "stock-details",
      value: "Default",
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

  public generateComponent(
    component: StockDetailsModel,
    parent?: UIComponentController
  ): StockDetailsController {
    return new StockDetailsController(component, this.factoriesManager, parent);
  }
}

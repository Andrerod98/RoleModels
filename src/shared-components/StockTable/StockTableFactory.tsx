import React from "react";
import { MdOutlineDraw } from "react-icons/md";
import { StockTableModel, StockTableController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class StockTableFactory extends UIComponentFactory {
  public get name() {
    return "stock-table";
  }

  public get example() {
    return {
      id: "stock-table-id",
      name: "stock-table",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <MdOutlineDraw />;
  }

  public generateComponent(
    component: StockTableModel,
    parent?: UIComponentController
  ): StockTableController {
    return new StockTableController(component, this.factoriesManager, parent);
  }
}

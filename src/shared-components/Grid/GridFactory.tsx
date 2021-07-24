import React from "react";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { GridUI, GridController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class GridFactory extends UIComponentFactory {
  public get name() {
    return "grid";
  }

  public get example() {
    return {
      id: "grid-id",
      name: "grid",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <BsFillGrid3X3GapFill />;
  }

  public generateComponent(
    component: GridUI,
    parent?: UIComponentController
  ): GridController {
    return new GridController(component, this.factoriesManager, parent);
  }
}

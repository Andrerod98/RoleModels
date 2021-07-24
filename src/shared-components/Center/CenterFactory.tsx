import React from "react";
import { BsArrowsAngleContract } from "react-icons/bs";
import { CenterUI, CenterController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class CenterFactory extends UIComponentFactory {
  public get name() {
    return "center";
  }

  public get example() {
    return {
      id: "center-id",
      name: "center",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <BsArrowsAngleContract />;
  }

  public generateComponent(
    component: CenterUI,
    parent?: UIComponentController
  ): CenterController {
    return new CenterController(component, this.factoriesManager, parent);
  }
}

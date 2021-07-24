import React from "react";
import { BiRectangle } from "react-icons/bi";
import { ButtonUI, ButtonController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class ButtonFactory extends UIComponentFactory {
  public get name() {
    return "button";
  }

  public get example() {
    return {
      id: "button-id",
      name: "button",
      value: "Button",
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

  public generateComponent(
    component: ButtonUI,
    parent?: UIComponentController
  ): ButtonController {
    return new ButtonController(component, this.factoriesManager, parent);
  }
}

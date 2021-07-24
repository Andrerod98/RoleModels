import React from "react";
import { BiCheckboxChecked } from "react-icons/bi";
import { CheckboxUI, CheckboxController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class CheckboxFactory extends UIComponentFactory {
  public get name() {
    return "checkbox";
  }

  public get example() {
    return {
      id: "checkbox-id",
      name: "checkbox",
    };
  }

  public get icon() {
    return <BiCheckboxChecked />;
  }

  public generateComponent(
    component: CheckboxUI,
    parent?: UIComponentController
  ): CheckboxController {
    return new CheckboxController(component, this.factoriesManager, parent);
  }
}

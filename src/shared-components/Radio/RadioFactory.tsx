import React from "react";
import { BiRadioCircleMarked } from "react-icons/bi";
import { RadioController, RadioUI } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class RadioFactory extends UIComponentFactory {
  public get name() {
    return "radio";
  }

  public get example() {
    return {
      id: "radio-id",
      name: "radio",
      width: 100,
      height: 40,
      type: "radio",
      label: "Mr.",
      value: "Mr.",
      values: ["Mr.", "Mrs."],
    };
  }

  public get icon() {
    return <BiRadioCircleMarked />;
  }

  public generateComponent(
    component: RadioUI,
    parent?: UIComponentController
  ): RadioController {
    return new RadioController(component, this.factoriesManager, parent);
  }
}

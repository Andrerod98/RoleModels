import React from "react";
import { RiInputMethodLine } from "react-icons/ri";
import { InputController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";
import { InputUI } from "./InputModel";

export class InputFactory extends UIComponentFactory {
  public get name() {
    return "input";
  }

  public get example() {
    return {
      id: "input-id",
      name: "input",
      label: "Default label",
      value: "Default text...",
    };
  }

  public get icon() {
    return <RiInputMethodLine />;
  }

  public generateComponent(
    component: InputUI,
    parent?: UIComponentController
  ): InputController {
    return new InputController(component, this.factoriesManager, parent);
  }
}

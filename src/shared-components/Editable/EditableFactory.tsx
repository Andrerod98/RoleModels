import React from "react";
import { RiInputMethodLine } from "react-icons/ri";
import { EditableUI, EditableController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class EditableFactory extends UIComponentFactory {
  public get name() {
    return "editable";
  }

  public get example() {
    return {
      id: "editable-id",
      name: "editable",
      value: "",
    };
  }

  public get icon() {
    return <RiInputMethodLine />;
  }

  public generateComponent(
    component: EditableUI,
    parent?: UIComponentController
  ): EditableController {
    return new EditableController(component, this.factoriesManager, parent);
  }
}

import React from "react";
import { BiRectangle } from "react-icons/bi";
import { TextModel, TextController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class TextFactory extends UIComponentFactory {
  public get name() {
    return "text";
  }

  public get example() {
    return {
      id: "text-id",
      name: "text",
      value: "Default",
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

  public generateComponent(
    component: TextModel,
    parent?: UIComponentController
  ): TextController {
    return new TextController(component, this.factoriesManager, parent);
  }
}

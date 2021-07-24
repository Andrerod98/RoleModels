import React from "react";
import { BiListUl } from "react-icons/bi";
import { ListUI, ListController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class ListFactory extends UIComponentFactory {
  public get name() {
    return "list";
  }

  public get example() {
    return {
      id: "list-id",
      name: "list",
      width: "100px",
      height: "100px",
      items: ["one", "two", "three"],
    };
  }

  public get icon() {
    return <BiListUl />;
  }

  public generateComponent(
    component: ListUI,
    parent?: UIComponentController
  ): ListController {
    return new ListController(component, this.factoriesManager, parent);
  }
}

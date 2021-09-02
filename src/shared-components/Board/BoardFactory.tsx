import React from "react";
import { BiRectangle } from "react-icons/bi";
import { BoardModel, BoardController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class BoardFactory extends UIComponentFactory {
  public get name() {
    return "board";
  }

  public get example() {
    return {
      id: "board-id",
      name: "board",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

  public generateComponent(
    component: BoardModel,
    parent?: UIComponentController
  ): BoardController {
    return new BoardController(component, this.factoriesManager, parent);
  }
}

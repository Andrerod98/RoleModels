import { IInk } from "@fluidframework/ink";
import React from "react";
import { HiPencilAlt } from "react-icons/hi";
import { InkCanvasController } from ".";
import { FactoriesManager } from "../../shared-application/managers/FactoriesManager";
import { UIComponentController, UIComponentFactory } from "../UIComponent";
import { InkCanvasUI } from "./InkCanvasModel";

export class InkCanvasFactory extends UIComponentFactory {
  public get name() {
    return "ink";
  }

  public get example() {
    return {
      id: "ink-id",
      name: "ink",
      color: { r: 0, g: 255, b: 255, a: 1 },
      thickness: 1,
    };
  }

  public get icon() {
    return <HiPencilAlt />;
  }

  constructor(readonly ink: IInk, readonly factoriesManager: FactoriesManager) {
    super(factoriesManager);
  }

  public generateComponent(
    component: InkCanvasUI,
    parent?: UIComponentController
  ) {
    return new InkCanvasController(
      component,
      this.ink,
      this.factoriesManager,
      parent
    );
  }
}

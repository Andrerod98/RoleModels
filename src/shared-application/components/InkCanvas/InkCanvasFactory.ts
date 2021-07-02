import { IInk } from "@fluidframework/ink";
import { InkCanvasController } from ".";
import { FactoriesManager } from "../../managers/FactoriesManager";
import { UIComponentController, UIComponentFactory } from "../UIComponent";
import { InkCanvasUI } from "./InkCanvasModel";

export class InkCanvasFactory extends UIComponentFactory {
  constructor(
    readonly name: string,
    readonly ink: IInk,
    readonly factoriesManager: FactoriesManager
  ) {
    super(name, factoriesManager);
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

import { QRCodeController } from ".";
import { FactoriesManager } from "../../managers/FactoriesManager";
import { UIComponentController, UIComponentFactory } from "../UIComponent";
import { QRCodeUI } from "./QRCodeModel";

export class QRCodeFactory extends UIComponentFactory {
  constructor(
    readonly name: string,
    readonly factoriesManager: FactoriesManager
  ) {
    super(name, factoriesManager);
  }

  public generateComponent(
    component: QRCodeUI,
    parent?: UIComponentController
  ) {
    return new QRCodeController(component, this.factoriesManager, parent);
  }
}

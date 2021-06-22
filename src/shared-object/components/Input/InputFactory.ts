import { InputController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";
import { InputUI } from "./InputModel";

export class InputFactory extends UIComponentFactory {
  public generateComponent(
    component: InputUI,
    parent?: UIComponentController
  ): InputController {
    return new InputController(component, this.factoriesManager, parent);
  }
}

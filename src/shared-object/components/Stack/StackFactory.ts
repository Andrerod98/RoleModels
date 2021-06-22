import { StackUI, StackController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class StackFactory extends UIComponentFactory {
  public generateComponent(
    component: StackUI,
    parent?: UIComponentController
  ): StackController {
    return new StackController(component, this.factoriesManager, parent);
  }
}

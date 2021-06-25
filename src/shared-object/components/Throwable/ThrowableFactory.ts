import { ThrowableUI, ThrowableController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class ThrowableFactory extends UIComponentFactory {
  public generateComponent(
    component: ThrowableUI,
    parent?: UIComponentController
  ): ThrowableController {
    return new ThrowableController(component, this.factoriesManager, parent);
  }
}

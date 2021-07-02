import { CheckboxUI, CheckboxController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class CheckboxFactory extends UIComponentFactory {
  public generateComponent(
    component: CheckboxUI,
    parent?: UIComponentController
  ): CheckboxController {
    return new CheckboxController(component, this.factoriesManager, parent);
  }
}

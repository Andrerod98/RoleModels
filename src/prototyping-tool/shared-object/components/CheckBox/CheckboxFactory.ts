import { CheckboxUI, CheckboxController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class CheckboxFactory extends UIComponentFactory {
  public generateComponent(component: CheckboxUI): CheckboxController {
    return new CheckboxController(component, this.factoriesManager);
  }
}

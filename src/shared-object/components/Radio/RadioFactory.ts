import { RadioController, RadioUI } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class RadioFactory extends UIComponentFactory {
  public generateComponent(
    component: RadioUI,
    parent?: UIComponentController
  ): RadioController {
    return new RadioController(component, this.factoriesManager, parent);
  }
}

import { ButtonUI, ButtonController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class ButtonFactory extends UIComponentFactory {
  public generateComponent(
    component: ButtonUI,
    parent?: UIComponentController
  ): ButtonController {
    return new ButtonController(component, this.factoriesManager, parent);
  }
}

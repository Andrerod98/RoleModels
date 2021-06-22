import { FlexUI, FlexController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class FlexFactory extends UIComponentFactory {
  public generateComponent(
    component: FlexUI,
    parent?: UIComponentController
  ): FlexController {
    return new FlexController(component, this.factoriesManager, parent);
  }
}

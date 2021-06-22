import { BoxUI, BoxController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class BoxFactory extends UIComponentFactory {
  public generateComponent(
    component: BoxUI,
    parent?: UIComponentController
  ): BoxController {
    return new BoxController(component, this.factoriesManager, parent);
  }
}

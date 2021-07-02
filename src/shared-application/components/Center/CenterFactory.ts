import { CenterUI, CenterController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class CenterFactory extends UIComponentFactory {
  public generateComponent(
    component: CenterUI,
    parent?: UIComponentController
  ): CenterController {
    return new CenterController(component, this.factoriesManager, parent);
  }
}

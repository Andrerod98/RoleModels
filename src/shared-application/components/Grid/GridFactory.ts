import { GridUI, GridController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class GridFactory extends UIComponentFactory {
  public generateComponent(
    component: GridUI,
    parent?: UIComponentController
  ): GridController {
    return new GridController(component, this.factoriesManager, parent);
  }
}

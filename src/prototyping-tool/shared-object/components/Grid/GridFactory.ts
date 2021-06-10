import { GridUI, GridController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class GridFactory extends UIComponentFactory {
  public generateComponent(component: GridUI): GridController {
    return new GridController(component);
  }
}

import { MapUI, MapController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class MapFactory extends UIComponentFactory {
  public generateComponent(
    component: MapUI,
    parent?: UIComponentController
  ): MapController {
    return new MapController(component, this.factoriesManager, parent);
  }
}

import { MapUI, MapController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class MapFactory extends UIComponentFactory {
  public generateComponent(component: MapUI): MapController {
    return new MapController(component);
  }
}

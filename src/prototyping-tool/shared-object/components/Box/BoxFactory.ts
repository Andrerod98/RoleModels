import { BoxUI, BoxController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class BoxFactory extends UIComponentFactory {
  public generateComponent(component: BoxUI): BoxController {
    return new BoxController(component);
  }
}

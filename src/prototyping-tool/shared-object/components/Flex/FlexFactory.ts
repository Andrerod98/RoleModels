import { FlexUI, FlexController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class FlexFactory extends UIComponentFactory {
  public generateComponent(component: FlexUI): FlexController {
    return new FlexController(component);
  }
}

import { RadioController, RadioUI } from ".";
import { UIComponentFactory } from "../UIComponent";

export class RadioFactory extends UIComponentFactory {
  public generateComponent(component: RadioUI): RadioController {
    return new RadioController(component);
  }
}

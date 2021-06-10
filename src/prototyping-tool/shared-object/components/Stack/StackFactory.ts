import { StackUI, StackController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class StackFactory extends UIComponentFactory {
  public generateComponent(component: StackUI): StackController {
    return new StackController(component);
  }
}

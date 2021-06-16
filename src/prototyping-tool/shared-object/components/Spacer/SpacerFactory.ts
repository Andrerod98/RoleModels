import { SpacerController, SpacerUI } from ".";
import { UIComponentFactory } from "../UIComponent";

export class SpacerFactory extends UIComponentFactory {
  public generateComponent(component: SpacerUI): SpacerController {
    return new SpacerController(component, this.factoriesManager);
  }
}

import { SpacerController, SpacerUI } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class SpacerFactory extends UIComponentFactory {
  public generateComponent(
    component: SpacerUI,
    parent?: UIComponentController
  ): SpacerController {
    return new SpacerController(component, this.factoriesManager, parent);
  }
}

import { SliderUI, SliderController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class SliderFactory extends UIComponentFactory {
  public generateComponent(
    component: SliderUI,
    parent?: UIComponentController
  ): SliderController {
    return new SliderController(component, this.factoriesManager, parent);
  }
}

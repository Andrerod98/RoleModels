import { SliderUI, SliderController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class SliderFactory extends UIComponentFactory {
  public generateComponent(component: SliderUI): SliderController {
    return new SliderController(component, this.factoriesManager);
  }
}

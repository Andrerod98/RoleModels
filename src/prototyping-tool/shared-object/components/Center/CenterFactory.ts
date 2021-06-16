import { CenterUI, CenterController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class CenterFactory extends UIComponentFactory {
  public generateComponent(component: CenterUI): CenterController {
    return new CenterController(component, this.factoriesManager);
  }
}

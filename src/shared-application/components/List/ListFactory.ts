import { ListUI, ListController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class ListFactory extends UIComponentFactory {
  public generateComponent(
    component: ListUI,
    parent?: UIComponentController
  ): ListController {
    return new ListController(component, this.factoriesManager, parent);
  }
}

import { ListUI, ListController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class ListFactory extends UIComponentFactory {
  public generateComponent(component: ListUI): ListController {
    return new ListController(component);
  }
}

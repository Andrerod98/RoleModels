import { EditableUI, EditableController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class EditableFactory extends UIComponentFactory {
  public generateComponent(component: EditableUI): EditableController {
    return new EditableController(component, this.factoriesManager);
  }
}

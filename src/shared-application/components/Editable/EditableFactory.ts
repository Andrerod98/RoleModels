import { EditableUI, EditableController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class EditableFactory extends UIComponentFactory {
  public generateComponent(
    component: EditableUI,
    parent?: UIComponentController
  ): EditableController {
    return new EditableController(component, this.factoriesManager, parent);
  }
}

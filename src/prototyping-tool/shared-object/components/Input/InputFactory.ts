import { InputController } from ".";
import { UIComponentFactory } from "../UIComponent";
import { InputUI } from "./InputModel";

export class InputFactory extends UIComponentFactory {
  public generateComponent(component: InputUI): InputController {
    return new InputController(component);
  }
}

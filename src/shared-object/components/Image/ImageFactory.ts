import { ImageUI, ImageController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class ImageFactory extends UIComponentFactory {
  public generateComponent(
    component: ImageUI,
    parent?: UIComponentController
  ): ImageController {
    return new ImageController(component, this.factoriesManager, parent);
  }
}

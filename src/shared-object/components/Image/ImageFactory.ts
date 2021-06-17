import { ImageUI, ImageController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class ImageFactory extends UIComponentFactory {
  public generateComponent(component: ImageUI): ImageController {
    return new ImageController(component, this.factoriesManager);
  }
}

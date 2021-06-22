import { LinkUI, LinkController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class LinkFactory extends UIComponentFactory {
  public generateComponent(
    component: LinkUI,
    parent?: UIComponentController
  ): LinkController {
    return new LinkController(component, this.factoriesManager, parent);
  }
}

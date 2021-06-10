import { LinkUI, LinkController } from ".";
import { UIComponentFactory } from "../UIComponent";

export class LinkFactory extends UIComponentFactory {
  public generateComponent(component: LinkUI): LinkController {
    return new LinkController(component);
  }
}

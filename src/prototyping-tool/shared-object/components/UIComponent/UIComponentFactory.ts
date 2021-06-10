import { IUIComponent, UIComponentController } from ".";

export class UIComponentFactory {
  constructor(readonly name: string) {}

  public generateComponent(component: IUIComponent) {
    return new UIComponentController(component);
  }
}

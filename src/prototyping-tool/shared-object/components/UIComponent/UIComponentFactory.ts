import { IUIComponent, UIComponentController } from ".";

export class UIComponentFactory {
  constructor(readonly name: string, readonly factoriesManager) {}

  public generateComponent(component: IUIComponent) {
    return new UIComponentController(component, this.factoriesManager);
  }
}

import { IUIComponent, UIComponentController } from ".";

export class UIComponentFactory {
  constructor(readonly name: string, readonly factoriesManager) {}

  public generateComponent(
    component: IUIComponent,
    parent?: UIComponentController
  ) {
    return new UIComponentController(component, this.factoriesManager, parent);
  }
}

export class GenericUIComponentFactory<M extends IUIComponent> {
  constructor(readonly name: string, readonly factoriesManager) {}

  public generateComponent(component: M, parent?: UIComponentController) {
    return new UIComponentController(component, this.factoriesManager, parent);
  }
}

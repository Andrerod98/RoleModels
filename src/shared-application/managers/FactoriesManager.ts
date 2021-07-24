import {
  IUIComponent,
  UIComponentController,
  UIComponentFactory,
} from "../../shared-components/UIComponent";

export class FactoriesManager {
  private factories: Map<string, UIComponentFactory>;

  constructor() {
    this.factories = new Map<string, UIComponentFactory>();
  }

  public registerFactory(factory: UIComponentFactory) {
    this.factories.set(factory.name, factory);
  }

  public getFactory(name: string) {
    return this.factories.get(name);
  }

  public getFactories() {
    return this.factories.values();
  }

  public getUIComponent(
    component: IUIComponent,
    parent?: UIComponentController
  ) {
    let factory = this.factories.get(component.name);
    if (!factory) {
      factory = this.factories.get("uicomponent");
    }
    return factory.generateComponent(component, parent);
  }
}

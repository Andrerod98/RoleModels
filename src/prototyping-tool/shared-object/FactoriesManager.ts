import { IUIComponent, UIComponentFactory } from "./components/UIComponent";

export class FactoriesManager {
  private factories: Map<string, UIComponentFactory>;

  private static _instance: FactoriesManager = new FactoriesManager();

  constructor() {
    if (FactoriesManager._instance) {
      throw new Error(
        "Error: Instantiation failed: Use SingletonClass.getInstance() instead of new."
      );
    }

    this.factories = new Map<string, UIComponentFactory>();
    FactoriesManager._instance = this;
  }

  public static getInstance(): FactoriesManager {
    return FactoriesManager._instance;
  }

  public registerFactory(factory: UIComponentFactory) {
    this.factories.set(factory.name, factory);
  }

  public getUIComponent(component: IUIComponent) {
    let factory = this.factories.get(component.name);
    if (factory === undefined) {
      factory = this.factories.get("uicomponent");
    }

    return factory.generateComponent(component);

    /*
    switch (component.name) {
      case "map":
        return new MapController(component as MapUI);
      case "img":
        return new ImageController(component as ImageUI);
      case "input":
        return new InputController(component as InputUI);
      case "radio":
        return new RadioController(component as RadioUI);
      case "a":
        return new LinkController(component as LinkUI);
      case "list":
        return new ListController(component as ListUI);
      default:
        return new UIComponentController(component);
    }*/
  }
}

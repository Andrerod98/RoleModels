import React from "react";
import { BiRectangle } from "react-icons/bi";
import { IUIComponent, UIComponentController } from ".";

export class UIComponentFactory {
  constructor(readonly factoriesManager) {}

  public get name() {
    return "uicomponent";
  }

  public get example(): any {
    return {
      id: "button-id",
      name: "Button",
      value: "Button",
    };
  }

  public get icon() {
    return <BiRectangle />;
  }

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

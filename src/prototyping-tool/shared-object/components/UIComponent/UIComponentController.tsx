/* eslint-disable no-undef */
import * as React from "react";
import { FactoriesManager } from "../../FactoriesManager";
import { IUIComponent } from "./UIComponentModel";
import { UIComponentView } from "./UIComponentView";

export class UIComponentController {
  protected listeners: { [event: string]: (...args) => any };
  parent: UIComponentController;
  children: UIComponentController[];

  constructor(
    protected model: IUIComponent,
    readonly factoriesManager: FactoriesManager,
    parent?: UIComponentController
  ) {
    this.listeners = {};
    this.parent = parent;
    this.children = [];

    model.children.forEach((child) => this.addChild(child));
  }

  createController(model: IUIComponent) {
    console.log("Adding child,");
    console.log(model);
    const controller = this.factoriesManager.getUIComponent(model);
    // .new UIComponentController(model, this);
    return controller;
  }

  isRoot() {
    return this.parent == undefined;
  }

  getWidth() {
    return 0;
  }

  getHeight() {
    return 0;
  }

  get() {
    return this.model;
  }

  getParent() {
    return this.parent;
  }

  addChild(model: IUIComponent) {
    const controller = this.factoriesManager.getUIComponent(model);
    this.children.push(controller);
  }

  removeChild(value: UIComponentController) {}

  getChildByID(id: string): UIComponentController {
    return this.searchInNode(this, id);
  }

  public searchInNode(
    element: UIComponentController,
    matchingID: string
  ): UIComponentController | null {
    if (element.get().id == matchingID) {
      return element;
    } else if (element.children != null) {
      let i;
      let result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = this.searchInNode(element.children[i], matchingID);
      }
      return result;
    }
    return null;
  }

  getChildren() {
    return this.children;
  }

  update(model: IUIComponent) {
    this.model = model;
    this.children = [];

    model.children.forEach((child) => {
      this.addChild(child);
    });

    console.log(model);
    console.log("UPDATED");
    console.log(this.children);
  }

  addEventListener(listener: { [event: string]: (...args) => any }) {
    this.listeners = { ...this.listeners, ...listener };
  }

  removeEventListener() {}

  public toString(): string {
    return JSON.stringify(this.model);
  }

  public getListeners(): { [event: string]: (...args) => any } {
    return this.listeners;
  }

  public getListener(event: string): (...args) => any {
    if (this.listeners[event] === undefined) {
      return () => {};
    } else {
      return this.listeners[event];
    }
  }

  generateWidget(): JSX.Element {
    return <UIComponentView controller={this} />;
  }
}

export class GenericController<
  M extends IUIComponent
> extends UIComponentController {
  constructor(protected model: M, readonly factoriesManager: FactoriesManager) {
    super(model, factoriesManager);
  }
}

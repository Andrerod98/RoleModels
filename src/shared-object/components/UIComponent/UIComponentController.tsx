/* eslint-disable no-undef */
import EventEmitter from "events";
import * as React from "react";
import { FactoriesManager } from "../../FactoriesManager";
import { IUIComponent } from "./UIComponentModel";
import { UIComponentView } from "./UIComponentView";

export class UIComponentController extends EventEmitter {
  //protected listeners: { [event: string]: (...args) => any };
  parent: UIComponentController;
  children: UIComponentController[];

  constructor(
    protected model: IUIComponent,
    readonly factoriesManager: FactoriesManager,
    parent?: UIComponentController
  ) {
    super();
    //this.listeners = {};
    this.parent = parent;
    this.children = [];

    if (model.children !== undefined) {
      model.children.forEach((child) => this.addChild(child));
    }
  }

  createController(model: IUIComponent) {
    const controller = this.factoriesManager.getUIComponent(model);
    // .new UIComponentController(model, this);
    return controller;
  }

  getSnapshot(): IUIComponent {
    let snapshot = { ...this.model, children: [] };

    this.children.forEach((child) => {
      snapshot.children.push(child.getSnapshot());
    });

    return snapshot;
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

  getRoot(): UIComponentController {
    console.log(this.parent);
    if (this.parent == null) {
      return this;
    } else {
      return this.getParent().getRoot();
    }
  }

  addChild(model: IUIComponent) {
    const controller = this.factoriesManager.getUIComponent(model, this);
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

  update(model: any) {
    this.model = model;
    this.children = [];

    model.children.forEach((child) => {
      this.addChild(child);
    });

    console.log({ text: "Emitting change", root: this.getRoot() });
    this.getRoot().emit("componentChanged");
    //TODO: Send change to root
  }

  addEventListener(listener: { [event: string]: (...args) => any }) {
    //this.listeners = { ...this.listeners, ...listener };
  }

  removeEventListener() {}

  public toString(): string {
    return JSON.stringify(this.model);
  }

  public getListeners(): { [event: string]: (...args) => any } {
    return {};
    //return this.listeners;
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
  constructor(
    protected model: M,
    readonly factoriesManager: FactoriesManager,
    parent?: UIComponentController
  ) {
    super(model, factoriesManager, parent);
  }
}

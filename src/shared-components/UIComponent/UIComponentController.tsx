/* eslint-disable no-undef */
import EventEmitter from "events";
import * as React from "react";
import { FactoriesManager } from "../../shared-application/managers/FactoriesManager";
import { IUIComponent } from "./UIComponentModel";
import { UIComponentView } from "./UIComponentView";

export class UIComponentController extends EventEmitter {
  parent: UIComponentController;
  children: UIComponentController[];

  constructor(
    protected model: IUIComponent,
    readonly factoriesManager: FactoriesManager,
    parent?: UIComponentController
  ) {
    super();
    this.parent = parent;
    this.children = [];

    if (model.children !== undefined) {
      model.children.forEach((child) => this.addChild(child));
    }
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

  getChildren() {
    return this.children;
  }

  getRoot(): UIComponentController {
    if (this.parent == null) {
      return this;
    } else {
      return this.getParent().getRoot();
    }
  }

  getSnapshot(): IUIComponent {
    let snapshot = { ...this.model, children: [] };

    this.children.forEach((child) => {
      snapshot.children.push(child.getSnapshot());
    });

    return snapshot;
  }

  toComponentsString(): string[] {
    let componentsString = [this.model.id];

    for (const child of this.children) {
      componentsString = [...componentsString, ...child.toComponentsString()];
    }

    return componentsString;
  }

  addChild(model: IUIComponent) {
    const controller = this.factoriesManager.getUIComponent(model, this);
    this.children.push(controller);
  }

  removeChild(value: UIComponentController) {}

  getChildByID(id: string): UIComponentController {
    return this.searchInNode(this, id);
  }

  searchInNode(
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

  deleteEventListeners() {
    this.removeAllListeners();
    for (const child of this.children) {
      child.deleteEventListeners();
    }
  }

  emitEvent(eventName: string, ...args) {
    this.getRoot().emit("event", eventName, this.get().id, args);
  }

  update(model: any) {
    this.model = { ...model };
    this.children = [];

    model.children.forEach((child) => {
      this.addChild(child);
    });

    this.getRoot().emit("componentChanged", this.getRoot().getSnapshot());
    //TODO: Send change to root
  }

  toString(): string {
    return JSON.stringify(this.model);
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

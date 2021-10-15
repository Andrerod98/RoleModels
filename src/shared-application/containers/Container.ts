import { SharedCell } from "@fluidframework/cell";
import {
  IUIComponent,
  UIComponentController,
} from "../../shared-components/UIComponent";
import { Logger } from "../Logger";
import { FactoriesManager } from "../managers/FactoriesManager";
import { IContainer } from "./IContainer";

enum ViewEvents {
  Changed = "viewChanged",
  ComponentEvent = "componentEvent",
}

export class Container {
  protected root: UIComponentController;
  private id: string;
  constructor(
    protected readonly sharedView: SharedCell,
    private readonly factoriesManager: FactoriesManager
  ) {
    this.loadObject();
    this.setEventListener();
  }

  private setEventListener() {
    this.sharedView.on("valueChanged", () => {
      this.loadObject();
    });

    this.sharedView.on("viewChanged", (root: IUIComponent) => {
      this.setRoot(root);
      this.updateObject(this.toView());
    });
  }

  private loadObject() {
    const view = this.sharedView.get() as IContainer;
    this.id = view.id;
    this.setRoot(view.root);
  }

  /* GETTERS */

  public getSharedObject(): SharedCell {
    return this.sharedView;
  }

  public getObject(): IContainer {
    return this.sharedView.get();
  }

  public getId() {
    return this.id;
  }

  public getRoot() {
    return this.root;
  }

  public getComponentByID(componentId: string) {
    return this.root.getChildByID(componentId);
  }

  public setRoot(root: IUIComponent) {
    if (!root) {
      Logger.getInstance().error("The root was not set because its undefined.");
      return;
    }
    this.root = this.factoriesManager.getUIComponent(root);
    this.root.on("componentChanged", (snapshot) => {
      this.emitChange(snapshot);
    });

    this.root.on("event", (eventName, componentId, args) => {
      this.emitComponentEvent(eventName, componentId, args);
    });
  }

  public deleteEventListeners() {
    this.root.deleteEventListeners();
    this.sharedView.removeAllListeners();
  }

  public updateObject(object: IContainer) {
    this.sharedView.set(object);
  }

  public update(object: IContainer) {
    this.id = object.id;
    this.setRoot(object.root);

    this.emitChange();
  }

  public toView(): IContainer {
    return {
      id: this.id,
      root: this.root.getSnapshot(),
    };
  }

  static from(sharedView: SharedCell, factoriesManager: FactoriesManager) {
    const view = new Container(sharedView, factoriesManager);

    return view;
  }

  /* Callback functions */
  private emitChange(data?: any) {
    this.sharedView.emit(ViewEvents.Changed, data);
  }

  private emitComponentEvent(
    eventName: string,
    componentId: string,
    args: any[]
  ) {
    this.sharedView.emit(
      ViewEvents.ComponentEvent,
      eventName,
      componentId,
      args
    );
  }
}

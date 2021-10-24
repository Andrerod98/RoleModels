import { SharedCell } from "@fluidframework/cell";
import {
  IUIComponent,
  UIComponentController,
} from "../../shared-components/UIComponent";
import { Logger } from "../Logger";
import { FactoriesManager } from "../managers/FactoriesManager";
import { IContainer } from "./IContainer";

enum ContainerEvents {
  Changed = "containerChanged",
  ComponentEvent = "componentEvent",
}

export class Container {
  protected root: UIComponentController;
  private id: string;
  constructor(
    protected readonly sharedContainer: SharedCell,
    private readonly factoriesManager: FactoriesManager
  ) {
    this.loadObject();
    this.setEventListener();
  }

  private setEventListener() {
    this.sharedContainer.on("valueChanged", () => {
      this.loadObject();
    });

    this.sharedContainer.on("containerChanged", (root: IUIComponent) => {
      this.setRoot(root);
      this.updateObject(this.toContainer());
    });
  }

  private loadObject() {
    const container = this.sharedContainer.get() as IContainer;
    this.id = container.id;
    this.setRoot(container.root);
  }

  /* GETTERS */

  public getSharedObject(): SharedCell {
    return this.sharedContainer;
  }

  public getObject(): IContainer {
    return this.sharedContainer.get();
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
    this.sharedContainer.removeAllListeners();
  }

  public updateObject(object: IContainer) {
    this.sharedContainer.set(object);
  }

  public update(object: IContainer) {
    this.id = object.id;
    this.setRoot(object.root);

    this.emitChange();
  }

  public toContainer(): IContainer {
    return {
      id: this.id,
      root: this.root.getSnapshot(),
    };
  }

  static from(sharedContainer: SharedCell, factoriesManager: FactoriesManager) {
    const container = new Container(sharedContainer, factoriesManager);

    return container;
  }

  /* Callback functions */
  private emitChange(data?: any) {
    this.sharedContainer.emit(ContainerEvents.Changed, data);
  }

  private emitComponentEvent(
    eventName: string,
    componentId: string,
    args: any[]
  ) {
    this.sharedContainer.emit(
      ContainerEvents.ComponentEvent,
      eventName,
      componentId,
      args
    );
  }
}

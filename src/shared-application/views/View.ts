import { SharedCell } from "@fluidframework/cell";
import { IUIComponent, UIComponentController } from "../components/UIComponent";
import { FactoriesManager } from "../managers/FactoriesManager";
import { InteractionsManager } from "../managers/InteractionsManager";
import { IView } from "./IView";

enum ViewEvents {
  Changed = "viewChanged",
  ComponentEvent = "componentEvent",
}
export class View {
  protected root: UIComponentController;
  private id: string;
  private combinedViewID: string;
  constructor(
    protected readonly sharedView: SharedCell,
    private readonly factoriesManager: FactoriesManager,
    private readonly interactionsManager: InteractionsManager
  ) {
    this.loadObject();
    this.setEventListener();
  }

  private setEventListener() {
    this.sharedView.on("valueChanged", (e: any) => {
      this.loadObject();
    });

    this.sharedView.on("viewChanged", (root: IUIComponent) => {
      this.setRoot(root);
      this.updateObject(this.toView());
    });
  }

  private loadObject() {
    const view = this.sharedView.get() as IView;
    this.id = view.id;
    this.combinedViewID = view.combinedViewID;
    this.setRoot(view.root);
  }

  /* GETTERS */

  public getSharedObject(): SharedCell {
    return this.sharedView;
  }

  public getObject(): IView {
    return this.sharedView.get();
  }

  public getId() {
    return this.id;
  }

  public getRoot() {
    return this.root;
  }

  public getCombinedViewID() {
    return this.combinedViewID;
  }

  public getComponentByID(componentId: string) {
    return this.root.getChildByID(componentId);
  }

  public isCombined() {
    return this.combinedViewID !== "";
  }

  public setCombinedViewID(combinedViewId: string) {
    this.combinedViewID = combinedViewId;
  }

  public setRoot(root: IUIComponent) {
    this.root = this.factoriesManager.getUIComponent(root);
    this.root.on("componentChanged", (snapshot) => {
      this.emitChange(snapshot);
    });

    this.root.on("componentChangedSynced", (snapshot) => {
      this.updateObject(this.toView());
    });
    this.root.on("event", (eventName, componentId, args) => {
      this.emitComponentEvent(eventName, componentId, args);
    });
  }

  public deleteEventListeners() {
    this.root.deleteEventListeners();
    //this.removeAllListeners();
  }

  public updateObject(object: IView) {
    this.sharedView.set(object);
  }

  public update(object: IView) {
    this.id = object.id;
    this.combinedViewID = object.combinedViewID;

    this.setRoot(object.root);

    this.emitChange();
  }

  public toView(): IView {
    return {
      id: this.id,
      combinedViewID: this.combinedViewID,
      root: this.root.getSnapshot(),
    };
  }

  static from(
    sharedView: SharedCell,
    factoriesManager: FactoriesManager,
    interactionsManager: InteractionsManager
  ) {
    const view = new View(sharedView, factoriesManager, interactionsManager);

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

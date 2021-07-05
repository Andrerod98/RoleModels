import EventEmitter from "events";
import { IUIComponent, UIComponentController } from "../components/UIComponent";
import { FactoriesManager } from "../managers/FactoriesManager";
import { IView } from "./IView";

enum ViewEvents {
  Changed = "viewChanged",
}
export class View extends EventEmitter {
  protected root: UIComponentController;
  constructor(
    protected id: string,
    protected combinedViewID: string = "",
    private readonly factoriesManager: FactoriesManager,
    root: IUIComponent
  ) {
    super();
    this.setRoot(root);
  }

  /* GETTERS */
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
    console.log("SETTING ROOT");
    console.log(root);
    this.root = this.factoriesManager.getUIComponent(root);
    this.root.on("componentChanged", (snapshot) => {
      console.log("Component has changed");
      console.log(snapshot);
      this.emitChange(snapshot);
    });
  }

  public deleteEventListeners() {
    this.root.deleteEventListeners();
    this.removeAllListeners();
  }

  public update(object: IView) {
    console.log("UPDATING VIEW");
    console.log(object);
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

  static from(object: IView, factoriesManager: FactoriesManager) {
    const view = new View(
      object.id,
      object.combinedViewID,
      factoriesManager,
      object.root
    );

    return view;
  }

  /* Callback functions */

  private emitChange(data?: any) {
    this.emit(ViewEvents.Changed, data);
  }
}

import EventEmitter from "events";
import { IUIComponent, UIComponentController } from "../components/UIComponent";
import { FactoriesManager } from "../FactoriesManager";
import { IView } from "./IView";

enum ViewEvents {
  Changed = "viewChanged",
}
export class View extends EventEmitter {
  protected root: UIComponentController;
  constructor(
    protected id: string,
    protected rows: number,
    protected columns: number,
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

  public getRows() {
    return this.rows;
  }

  public getColumns() {
    return this.columns;
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

  public setRows(rows: number) {
    this.rows = rows;
  }

  public setColumns(columns: number) {
    this.columns = columns;
  }

  public setRoot(root: IUIComponent) {
    this.root = this.factoriesManager.getUIComponent(root);
    this.root.on("componentChanged", () => {
      console.log("Component has changed");
      this.emitChange(this.getRoot().getSnapshot());
    });
  }

  public update(object: IView) {
    this.id = object.id;
    this.rows = object.rows;
    this.columns = object.cols;
    this.combinedViewID = object.combinedViewID;

    this.setRoot(object.root);

    this.emitChange();
  }

  public toView(): IView {
    return {
      id: this.id,
      rows: this.rows,
      cols: this.columns,
      combinedViewID: this.combinedViewID,
      root: this.root.getSnapshot(),
    };
  }

  static from(object: IView, factoriesManager: FactoriesManager) {
    const view = new View(
      object.id,
      object.rows,
      object.cols,
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

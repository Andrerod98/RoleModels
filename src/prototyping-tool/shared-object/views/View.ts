import { IUIComponent, UIComponentController } from "../components/UIComponent";
import { FactoriesManager } from "../FactoriesManager";
import { IView } from "./IView";

export class View {
  private updateEvent: () => void = () => {};
  protected root: UIComponentController;

  constructor(
    protected id: string,
    protected rows: number,
    protected columns: number,
    protected combinedViewID: string = "",
    root: IUIComponent
  ) {
    this.combinedViewID = combinedViewID;
    console.log(root);
    this.root = FactoriesManager.getInstance().getUIComponent(root);
  }

  public getId() {
    return this.id;
  }

  public getRows() {
    return this.rows;
  }

  public getColumns() {
    return this.columns;
  }

  public setCombinedViewID(id: string) {
    this.combinedViewID = id;
  }

  public setRows(rows: number) {
    this.rows = rows;
  }

  public setColumns(columns: number) {
    this.columns = columns;
  }

  public setRoot(root: IUIComponent) {
    this.root = new UIComponentController(root);
  }

  public getRoot() {
    return this.root;
  }

  public isCombined() {
    return this.combinedViewID != "";
  }

  public getCombinedViewID() {
    return this.combinedViewID;
  }

  public getComponentByID(id: string): UIComponentController {
    return this.root.getChildByID(id);
  }

  /* public getComponent(id: string): UIComponentController {
    const node = this.DOM.search(id);
    if (node == null) {
      console.error("Component " + id + " does not exist.");
      return undefined;
    } else {
      return node.get();
    }
  }

  public addComponent(comp: UIComponentController) {
    if (
      this.components.some(
        (component) => component.component.id === comp.component.id
      )
    ) {
      return console.error(
        "Component" + comp.component.id + "already exists in the view."
      );
    } else {
      this.components.push(comp);
    }
  }

  public addComponents(...comps: UIComponentController[]) {
    comps.forEach((comp) => {
      if (
        !this.components.some(
          (component) => component.component.id === comp.component.id
        )
      )
        this.components.push(comp);
    });
  }

  public defineComponents(comps: UIComponentController[]) {
    this.components = comps;
  }

  public updateComponent(component: UIComponentController) {
    const elem = this.components.find(
      (c) => c.component.id === component.component.id
    );

    if (elem === undefined) {
      console.error("Element not found so it was not updated");
    }

    elem.update(component.component);
  }
*/
  public toView(): IView {
    return {
      id: this.id,
      rows: this.rows,
      cols: this.columns,
      combinedViewID: this.combinedViewID,
      root: this.root.get(),
    };
  }

  public onUpdate(listener: () => void) {
    this.updateEvent = listener;
  }

  public update(object: IView) {
    this.id = object.id;
    this.rows = object.rows;
    this.columns = object.cols;
    this.combinedViewID = object.combinedViewID;
    console.log("updated");
    console.log(object);
    this.root.update(object.root);

    if (this.updateEvent !== undefined) this.updateEvent();
  }

  static from(object: IView) {
    console.log(object);
    const view = new View(
      object.id,
      object.rows,
      object.cols,
      object.combinedViewID,
      object.root
    );

    return view;
  }
}

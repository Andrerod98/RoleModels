import { SharedCell } from "@fluidframework/cell";
import { FactoriesManager } from "../managers/FactoriesManager";
import { IView } from "../views/IView";
import { View } from "../views/View";
import { IRole } from "./IRole";

export class Role {
  private name: string;
  private viewsIds: string[];
  private combinedViewsIds: string[];
  private qrsIds: string[];

  constructor(
    protected readonly sharedRole: SharedCell,
    protected readonly factoriesManager: FactoriesManager
  ) {
    this.name = "";
    this.viewsIds = [];
    this.combinedViewsIds = [];
    this.qrsIds = [];
    this.loadObject();
    this.setEventListener();
  }

  private setEventListener() {
    this.sharedRole.on("valueChanged", (e: any) => {
      this.loadObject();
    });
  }

  public loadObject() {
    const role = this.sharedRole.get() as IRole;
    this.name = role.name;
    this.combinedViewsIds = role.combinedViewsIds;
    this.qrsIds = role.qrIds;
    this.viewsIds = role.viewsIds;

    /*const tempArray = [];

    role.views.forEach((v) => {
      const view = this.viewsIds.find((v2) => v2.getId() === v.id);
      if (view) {
        view.update(v);
        tempArray.push(view);
      } else {
        const newView = View.from(v, this.factoriesManager);
        tempArray.push(newView);
      }
    });
    this.viewsIds = tempArray;
    for (const v of this.viewsIds) {
      v.removeAllListeners();
      v.on("viewChanged", (root) => {
        if (root) {
          v.setRoot(root);
          this.updateView(v);
        }
      });
    }*/
  }

  public onChange(listener: () => void) {
    this.sharedRole.on("valueChanged", listener);
  }

  /* GETTERS */
  public getObject(): IRole {
    return this.sharedRole.get();
  }

  public getSharedObject(): SharedCell {
    return this.sharedRole;
  }

  public getName(): string {
    return this.name;
  }

  public getViews(): string[] {
    return this.viewsIds;
  }

  public getCombinedViewsIds(): string[] {
    return this.combinedViewsIds;
  }

  public getQRIds(): string[] {
    return this.qrsIds;
  }

  public hasView(view: View): boolean {
    return this.viewsIds.includes(view.getId());
  }

  public hasViewWithId(id: string): boolean {
    return this.viewsIds.some((viewId) => viewId == id);
  }

  /*
  public hasViewWithCombinedView(cvid: string): boolean {
    return this.viewsIds.some((role) => role.getCombinedViewID() == cvid);
  }

  public getViewWithCombinedView(cvid: string): View {
    return this.viewsIds.find((role) => role.getCombinedViewID() == cvid);
  }
*/

  public addView(view: View): void {
    this.viewsIds.push(view.getId());
    this.updateViews(this.viewsIds);
  }

  public removeView(viewId: string): void {
    const index = this.viewsIds.findIndex((view) => view === viewId);

    if (index !== -1) {
      this.viewsIds.splice(index, 1);
      //this.updateViews(this.viewsIds);
    }
  }

  public updateName(newName: string) {
    this.sharedRole.set({ ...this.getObject(), name: newName });
  }

  public updateViews(newViews: string[]) {
    this.sharedRole.set({
      ...this.getObject(),
      viewsIds: newViews,
    });
  }

  public updateIViews(newViews: IView[]) {
    this.sharedRole.set({
      ...this.getObject(),
      viewsIds: newViews.map((v) => v.id),
    });
  }

  public updateCombinedViews(newCombinedViews: string[]) {
    this.sharedRole.set({
      ...this.getObject(),
      combinedViews: newCombinedViews,
    });
  }

  public updateQrs(newQrs: string[]) {
    this.sharedRole.set({
      ...this.getObject(),
      qrIds: newQrs,
    });
  }

  /*public updateView(view: View) {
    const index = this.viewsIds.findIndex((v) => v.getId() === view.getId());

    if (index == -1) {
      return;
    }

    this.viewsIds[index] = view;
    this.updateViews(this.viewsIds);
  }*/

  public addCombinedView(cvid: string) {
    this.combinedViewsIds.push(cvid);
    this.updateCombinedViews(this.combinedViewsIds);
  }

  public addQRCode(qrid: string) {
    this.qrsIds.push(qrid);
    this.updateQrs(this.qrsIds);
  }

  /* public deleteAllViewsListeners() {
    this.viewsIds.forEach((view) => {
      view.deleteEventListeners();
    });
  }*/
  public toRole(): IRole {
    return {
      name: this.name,
      viewsIds: this.viewsIds,
      combinedViewsIds: this.combinedViewsIds,
      qrIds: this.qrsIds,
    };
  }
}

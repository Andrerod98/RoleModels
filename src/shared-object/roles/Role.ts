import { SharedCell } from "@fluidframework/cell";
import { FactoriesManager } from "../FactoriesManager";
import { IView } from "../views/IView";
import { View } from "../views/View";
import { IRole } from "./IRole";

export class Role {
  private name: string;
  private views: View[];
  private combinedViewsIds: string[];
  private qrsIds: string[];

  constructor(
    protected readonly sharedRole: SharedCell,
    protected readonly factoriesManager: FactoriesManager
  ) {
    this.name = "";
    this.views = [];
    this.combinedViewsIds = [];
    this.qrsIds = [];
    this.loadObject();
    this.setEventListener();
  }

  private setEventListener() {
    this.sharedRole.on("valueChanged", (e: any) => {
      console.log("Role " + e.name + " changed so loading object.");
      this.loadObject();
    });
  }

  public loadObject() {
    const role = this.sharedRole.get() as IRole;
    this.name = role.name;
    this.combinedViewsIds = role.combinedViewsIds;
    this.qrsIds = role.qrIds;

    const tempArray = [];

    role.views.forEach((v) => {
      const view = this.views.find((v2) => v2.getId() === v.id);
      if (view) {
        view.update(v);
        tempArray.push(view);
      } else {
        tempArray.push(View.from(v, this.factoriesManager));
      }
    });
    this.views = tempArray;
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

  public getViews(): View[] {
    return this.views;
  }

  public getCombinedViewsIds(): string[] {
    return this.combinedViewsIds;
  }

  public getQRIds(): string[] {
    return this.qrsIds;
  }

  public getView(viewId: string): View {
    return this.views.find((view) => view.getId() === viewId);
  }

  public hasView(view: View): boolean {
    return this.views.includes(view);
  }

  public hasViewWithId(id: string): boolean {
    return this.views.some((role) => role.getId() == id);
  }

  public hasViewWithCombinedView(cvid: string): boolean {
    return this.views.some((role) => role.getCombinedViewID() == cvid);
  }

  public getViewWithCombinedView(cvid: string): View {
    return this.views.find((role) => role.getCombinedViewID() == cvid);
  }

  public addView(view: View): void {
    this.views.push(view);
    this.updateViews(this.views);
  }

  public removeView(viewId: string): void {
    const index = this.views.findIndex((view) => view.getId() === viewId);

    if (index !== -1) {
      this.views.splice(index, 1);
      this.updateViews(this.views);
    }
  }

  public updateName(newName: string) {
    this.sharedRole.set({ ...this.getObject(), name: newName });
  }

  public updateViews(newViews: View[]) {
    this.sharedRole.set({
      ...this.getObject(),
      views: newViews.map((v) => v.toView()),
    });
  }

  public updateIViews(newViews: IView[]) {
    this.sharedRole.set({
      ...this.getObject(),
      views: newViews,
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

  public updateView(view: View) {
    const index = this.views.findIndex((v) => v.getId() === view.getId());

    if (index == -1) {
      return;
    }

    this.views[index] = view;
    this.updateViews(this.views);
  }

  public addCombinedView(cvid: string) {
    this.combinedViewsIds.push(cvid);
    this.updateCombinedViews(this.combinedViewsIds);
  }

  public addQRCode(qrid: string) {
    this.qrsIds.push(qrid);
    this.updateQrs(this.qrsIds);
  }

  public deleteAllViewsListeners() {
    this.views.forEach((view) => {
      view.deleteEventListeners();
    });
  }
  public toRole(): IRole {
    return {
      name: this.name,
      views: this.views.map((view) => view.toView()),
      combinedViewsIds: this.combinedViewsIds,
      qrIds: this.qrsIds,
    };
  }
}

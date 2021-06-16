/* eslint-disable @typescript-eslint/no-empty-function */

import EventEmitter from "events";
import { IView } from "../../../prototyping-tool/shared-object/views/IView";
import { View } from "../../../prototyping-tool/shared-object/views/View";

export class LayoutManager extends EventEmitter {
  views: View[];

  constructor() {
    super();
    this.views = [];
  }

  public addView(view: View) {
    if (this.views.some((v) => v.getId() === view.getId())) return;

    this.views.push(view);
    this.emit("change");
  }

  public changeView(view: View) {
    const index = this.views.findIndex((v) => v.getId() === view.getId());
    if (index === -1) {
      return;
    } else {
      this.views[index] = view;
    }
  }

  public addUIComponent(parentId: string) {}

  public getViews(): View[] {
    return this.views;
  }

  public setViews(views: IView[]) {
    if (views === undefined) return;
    //this.views = views.map((v) => View.from(v, this.facto));
    this.emit("change");
  }
}

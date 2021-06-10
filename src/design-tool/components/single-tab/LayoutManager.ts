/* eslint-disable @typescript-eslint/no-empty-function */

import { IView } from "../../../prototyping-tool/shared-object/views/IView";
import { View } from "../../../prototyping-tool/shared-object/views/View";

export class LayoutManager {
  views: View[];

  constructor(protected changeEmitter: () => void) {
    this.views = [];
  }

  public addView(view: View) {
    if (this.views.some((v) => v.getId() === view.getId())) return;

    this.views.push(view);
    this.changeEmitter();
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
    this.views = views.map((v) => View.from(v));
    this.changeEmitter();
  }
}

import { SharedMap } from "@fluidframework/map";
import { SharedCell } from "@fluidframework/cell";
import { FactoriesManager } from "./FactoriesManager";
import EventEmitter from "events";
import { View } from "../views/View";
import { InteractionsManager } from "./InteractionsManager";
import { PrototypingToolDataObject } from "../shared-object/PrototypingToolDataObject";
import { Logger } from "../Logger";

enum ViewsManagerEvents {
  ChangeState = "changeState",
}

/* This class is responsible for managing the views */
export class ViewsManager extends EventEmitter {
  private views: Map<String, View>;

  private lastCommit: number;

  public constructor(
    private readonly viewsSharedMap: SharedMap,
    private readonly factoriesManager: FactoriesManager,
    private readonly interactionsManager: InteractionsManager,
    private readonly app: PrototypingToolDataObject
  ) {
    super();
    this.views = new Map<String, View>();
    this.setEventListener();
    this.lastCommit = 0;
  }

  /* Defines the event listeners needed */
  private setEventListener() {
    this.viewsSharedMap.on("valueChanged", async () => {
      this.lastCommit++;
      await this.loadViews(this.lastCommit);
      this.emitChange();
    });
  }

  /* Loads the combined views from the shared combined views map */
  public async loadViews(commit: number) {
    const promises = [];
    for (const handle of this.viewsSharedMap.values()) {
      promises.push(handle.get());
    }

    const combinedViews = await Promise.all(promises);

    if (this.lastCommit > commit) {
      return;
    }
    const newCVS = new Map<string, View>();
    combinedViews.forEach((combinedView) => {
      if (combinedView) {
        const cv = this.loadView(combinedView);
        newCVS.set(cv.getId(), cv);
      }
    });

    this.views = newCVS;
    Logger.getInstance().info(`${this.viewsSharedMap.size} views loaded.`);
    console.log(this.viewsSharedMap.size + " Views Loaded.");
  }

  /* Load a combined view from the shared combined view */
  public loadView(sharedView: SharedCell): View {
    const viewValue = sharedView.get();
    let view: View;
    if (this.views.has(viewValue.id)) {
      view = this.views.get(viewValue.id);
      view.update(viewValue);
    } else {
      view = View.from(sharedView, this.factoriesManager);

      this.views.set(view.getId(), view);
    }
    sharedView.off("valueChanged", () => {
      this.emitChange("Cell of " + viewValue.name + " changed.");
    });
    sharedView.on("valueChanged", () => {
      this.emitChange("Cell of " + viewValue.name + " changed.");
    });

    sharedView.off(
      "componentEvent",
      (eventName: string, componentId: string, args) => {
        const interaction = this.interactionsManager.getInteraction(
          sharedView.get().id + "/" + componentId + "/" + eventName
        );
        if (interaction && interaction.active) {
          const app = this.app;
          const view = this.getView(sharedView.get().id);
          const component = view.getRoot().getChildByID(componentId);
          console.log(app);
          console.log(view);
          console.log(component);
          eval(interaction.code);
        }
      }
    );

    sharedView.on(
      "componentEvent",
      (eventName: string, componentId: string, args) => {
        const interaction = this.interactionsManager.getInteraction(
          sharedView.get().id + "/" + componentId + "/" + eventName
        );
        if (interaction && interaction.active) {
          const app = this.app;
          const view = this.getView(sharedView.get().id);
          const component = view!.getRoot().getChildByID(componentId);
          console.log(app);
          console.log(view);
          console.log(component);
          eval(interaction.code);
        }
      }
    );

    return view;
  }

  /* GETTERS */

  /* Returns all the combined views */
  public getViews(): IterableIterator<View> {
    return this.views.values();
  }

  /* Returns all the combined views with ids */
  public getViewsByIds(cvids: string[]): View[] {
    const result = [];
    cvids.forEach((id) => {
      const cv = this.views.get(id);

      if (cv) result.push(cv);
    });
    return result;
  }

  /* Get a combined view by id */
  public getView(viewId: string): View {
    return this.views.get(viewId);
  }

  /* Checks if the combined view exists */
  public hasView(viewId: string): boolean {
    return this.viewsSharedMap.has(viewId);
  }

  /* Removes a combined view */
  public removeView(viewId: string): void {
    this.views.delete(viewId);
    this.viewsSharedMap.delete(viewId);
    Logger.getInstance().info(`A view with id ${viewId} has been removed.`);
  }

  /*
   * Adds a combined view to the combined views map and combined views shared map
   */
  public addView(sharedView: SharedCell): View {
    const sharedViewValue = sharedView.get();
    const id = sharedViewValue.id;
    if (this.viewsSharedMap.has(id)) {
      console.error("The view " + id + " already exists.");
      return;
    }

    /* Insert in shared map */
    this.viewsSharedMap.set(id, sharedView.handle);

    /* Get Combined View */
    const view = View.from(sharedView, this.factoriesManager);

    this.views.set(id, view);

    Logger.getInstance().info(`A view with id ${id} has been added.`);

    return view;
  }

  /* Callback functions */

  private emitChange(message?: string) {
    this.emit(ViewsManagerEvents.ChangeState, message);
  }
}

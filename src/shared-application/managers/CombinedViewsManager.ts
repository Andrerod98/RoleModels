import { SharedMap } from "@fluidframework/map";
import { SharedCell } from "@fluidframework/cell";
import { CombinedView } from "../combined-views/combined-view/CombinedView";
import { CombinedViewFactory } from "../combined-views/CombinedViewFactory";
import { FactoriesManager } from "./FactoriesManager";
import { SingleCombinedView } from "../combined-views/single-combined-view";
import { MultiCombinedView } from "../combined-views/multi-combined-view";
import EventEmitter from "events";
import { StitchingCombinedView } from "../combined-views/stitching-combined-view/StitchingCombinedView";

enum CombinedViewsManagerEvents {
  ChangeState = "changeState",
}

/* This class is responsible for managing the combined views */
export class CombinedViewsManager extends EventEmitter {
  private combinedViews: Map<String, CombinedView>;

  private combinedViewsFactory = new CombinedViewFactory();
  private lastCommit: number;

  public constructor(
    private readonly combinedViewsSharedMap: SharedMap,
    private readonly factoriesManager: FactoriesManager
  ) {
    super();
    this.combinedViews = new Map<String, CombinedView>();
    this.setEventListener();
    this.lastCommit = 0;
  }

  /* Defines the event listeners needed */
  private setEventListener() {
    this.combinedViewsSharedMap.on("valueChanged", async () => {
      this.lastCommit++;
      await this.loadCombinedViews(this.lastCommit);
      this.emitChange();
    });
  }

  /* Loads the combined views from the shared combined views map */
  public async loadCombinedViews(commit: number) {
    const promises = [];
    for (const handle of this.combinedViewsSharedMap.values()) {
      promises.push(handle.get());
    }

    const combinedViews = await Promise.all(promises);

    if (this.lastCommit > commit) {
      return;
    }
    const newCVS = new Map<string, CombinedView>();
    combinedViews.forEach((combinedView) => {
      if (combinedView) {
        const cv = this.loadCombinedView(combinedView);
        newCVS.set(cv.getId(), cv);
      }
    });

    this.combinedViews = newCVS;
    console.log(this.combinedViewsSharedMap.size + " Combined Views Loaded.");
  }

  /* Load a combined view from the shared combined view */
  public loadCombinedView(sharedCombinedView: SharedCell): CombinedView {
    const combinedViewValue = sharedCombinedView.get();
    let combinedView: CombinedView;
    if (this.combinedViews.has(combinedViewValue.name)) {
      combinedView = this.combinedViews.get(combinedViewValue.name);
      combinedView.updateObjects();
    } else {
      combinedView = this.combinedViewsFactory.getCombinedView(
        sharedCombinedView,
        this.factoriesManager
      );

      this.combinedViews.set(combinedView.getId(), combinedView);
    }
    sharedCombinedView.off("valueChanged", () => {
      this.emitChange("Cell of " + combinedViewValue.name + " changed.");
    });
    sharedCombinedView.on("valueChanged", () => {
      this.emitChange("Cell of " + combinedViewValue.name + " changed.");
    });

    return combinedView;
  }

  /* GETTERS */

  /* Returns all the combined views */
  public getCombinedViews(): IterableIterator<CombinedView> {
    return this.combinedViews.values();
  }

  /* Returns all the combined views with ids */
  public getCombinedViewsByIds(cvids: string[]): CombinedView[] {
    const result = [];
    cvids.forEach((id) => {
      const cv = this.combinedViews.get(id);

      if (cv) result.push(cv);
    });
    return result;
  }

  /* Get a combined view by id */
  public getCombinedView(
    combinedViewId: string
  ):
    | CombinedView
    | SingleCombinedView
    | MultiCombinedView
    | StitchingCombinedView {
    const cv = this.combinedViews.get(combinedViewId);
    if (cv instanceof StitchingCombinedView) return cv as StitchingCombinedView;
    else if (cv instanceof SingleCombinedView) return cv as SingleCombinedView;
    else if (cv instanceof MultiCombinedView) return cv as MultiCombinedView;

    return cv;
  }

  /* Checks if the combined view exists */
  public hasCombinedView(combinedViewId: string): boolean {
    return this.combinedViewsSharedMap.has(combinedViewId);
  }

  /* Removes a combined view */
  public removeCombinedView(combinedViewId: string): void {
    this.combinedViews.delete(combinedViewId);
    this.combinedViewsSharedMap.delete(combinedViewId);
  }

  /*
   * Adds a combined view to the combined views map and combined views shared map
   */
  public addCombinedView(sharedCombinedView: SharedCell): CombinedView {
    const sharedCombinedViewValue = sharedCombinedView.get().id;
    const id = sharedCombinedViewValue.id;
    if (this.combinedViewsSharedMap.has(id)) {
      console.error("The role " + id + " already exists.");
      return;
    }

    /* Insert in shared map */
    this.combinedViewsSharedMap.set(id, sharedCombinedView.handle);

    /* Get Combined View */
    const combinedView = this.combinedViewsFactory.getCombinedView(
      sharedCombinedView,
      this.factoriesManager
    );

    this.combinedViews.set(id, combinedView);

    return combinedView;
  }

  /* Callback functions */

  private emitChange(message?: string) {
    this.emit(CombinedViewsManagerEvents.ChangeState, message);
  }
}

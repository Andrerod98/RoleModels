import { SharedMap } from "@fluidframework/map";
import { SharedCell } from "@fluidframework/cell";
import { CombinedView } from "../combined-views/combined-view/CombinedView";
import { CombinedViewFactory } from "../combined-views/CombinedViewFactory";
import { FactoriesManager } from "../FactoriesManager";
import { SingleCombinedView } from "../combined-views/single-combined-view";
import { MultiCombinedView } from "../combined-views/multi-combined-view";
import EventEmitter from "events";
import { StitchingCombinedView } from "../combined-views/stitching-combined-view/StitchingCombinedView";

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

  private setEventListener() {
    this.combinedViewsSharedMap.on("valueChanged", async (e: any, ...args) => {
      this.lastCommit++;
      console.log("Loading combined view.");
      await this.loadCombinedViews(this.lastCommit);

      this.emit("changeState");
      /* const combinedViewID = e.key;
      if (e.previousValue === undefined) {
        // added
        const sharedCell = await this.combinedViewsSharedMap
          .get<IFluidHandle<SharedCell>>(combinedViewID)
          .get();

        this.addCombinedView(sharedCell);
        sharedCell.on("valueChanged", () => {
          this.emit("changeState");
        });

        // this.roles.set(roleName, new Role(sharedCell, this.factoriesManager));
        // console.log("Adding " + roleName + " from map");
      }*/
    });
  }

  public removeCombinedView(id: string): void {
    this.combinedViews.delete(id);
  }

  public addCombinedView(sharedCombinedView: SharedCell): CombinedView {
    const id = sharedCombinedView.get().id;

    if (this.combinedViews.has(id)) {
      return;
    }
    /* Get Combined View */
    const combinedView = this.combinedViewsFactory.getCombinedView(
      sharedCombinedView,
      this.factoriesManager
    );

    /* Insert in shared map */
    // this.combinedViewsSharedMap.set(id, sharedCombinedView.handle);

    this.combinedViews.set(id, combinedView);

    return combinedView;
  }

  public loadCombinedView(
    sharedCombinedView: SharedCell
  ): CombinedView | CombinedView {
    const combinedView = sharedCombinedView.get();
    let cv: CombinedView;
    if (this.combinedViews.has(combinedView.name)) {
      cv = this.combinedViews.get(combinedView.name);
      cv.updateObjects();
    } else {
      cv = this.combinedViewsFactory.getCombinedView(
        sharedCombinedView,
        this.factoriesManager
      );

      this.combinedViews.set(cv.getId(), cv);
    }
    sharedCombinedView.off("valueChanged", () => {
      this.emit("changeState", "Cell of " + name + " changed.");
    });
    sharedCombinedView.on("valueChanged", () => {
      this.emit("changeState", "Cell of " + name + " changed.");
    });

    return cv;
  }

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
      if (combinedView !== undefined) {
        const cv = this.loadCombinedView(combinedView);
        newCVS.set(cv.getId(), cv);
      }
    });

    this.combinedViews = newCVS;
    console.log(this.combinedViewsSharedMap.size + " Combined Views Loaded.");
  }

  public has(id: string): boolean {
    return this.combinedViewsSharedMap.has(id);
  }

  public getCombinedView(
    id: string
  ):
    | CombinedView
    | SingleCombinedView
    | MultiCombinedView
    | StitchingCombinedView {
    const cv = this.combinedViews.get(id);
    console.log(cv);
    if (cv instanceof StitchingCombinedView) return cv as StitchingCombinedView;
    else if (cv instanceof SingleCombinedView) return cv as SingleCombinedView;
    else if (cv instanceof MultiCombinedView) return cv as MultiCombinedView;

    return cv;
  }

  public getCombinedViews(): CombinedView[] {
    return Array.from(this.combinedViews.values());
  }

  public getCombinedViewsWithIds(cvids: string[]): CombinedView[] {
    const result = [];
    cvids.forEach((id) => {
      const cv = this.combinedViews.get(id);

      if (cv !== undefined) result.push(cv);
    });
    return result;
  }
}

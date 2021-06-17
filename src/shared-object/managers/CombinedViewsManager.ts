import { SharedMap } from "@fluidframework/map";
import { SharedCell } from "@fluidframework/cell";
import { CombinedView } from "../combined-views/combined-view/CombinedView";
import { CombinedViewFactory } from "../combined-views/CombinedViewFactory";
import { FactoriesManager } from "../FactoriesManager";
import { SingleCombinedView } from "../combined-views/single-combined-view";
import { MultiCombinedView } from "../combined-views/multi-combined-view";
import { IFluidHandle } from "@fluidframework/core-interfaces";

/* This class is responsible for managing the combined views */
export class CombinedViewsManager {
  private combinedViews: Map<String, CombinedView>;

  private combinedViewsFactory = new CombinedViewFactory();

  public constructor(
    private readonly combinedViewsSharedMap: SharedMap,
    private readonly factoriesManager: FactoriesManager,
    private readonly changeState: () => void
  ) {
    this.combinedViews = new Map<String, CombinedView>();
    this.setEventListener();
  }

  private setEventListener() {
    this.combinedViewsSharedMap.on("valueChanged", async (e: any, ...args) => {
      const combinedViewID = e.key;
      if (e.previousValue === undefined) {
        // added
        const sharedCell = await this.combinedViewsSharedMap
          .get<IFluidHandle<SharedCell>>(combinedViewID)
          .get();

        this.addCombinedView(sharedCell);
        sharedCell.on("valueChanged", () => {
          this.changeState();
        });

        // this.roles.set(roleName, new Role(sharedCell, this.factoriesManager));
        // console.log("Adding " + roleName + " from map");
      }
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

  public loadCombinedView(sharedCombinedView: SharedCell): void {
    const combinedView = this.combinedViewsFactory.getCombinedView(
      sharedCombinedView,
      this.factoriesManager
    );

    this.combinedViews.set(combinedView.getId(), combinedView);
  }

  public async loadCombinedViews() {
    const promises = [];
    for (const handle of this.combinedViewsSharedMap.values()) {
      promises.push(handle.get());
    }

    const combinedViews = await Promise.all(promises);
    combinedViews.forEach((combinedView) => {
      if (combinedView !== undefined) {
        this.loadCombinedView(combinedView);
      }
    });

    console.log(this.combinedViewsSharedMap.size + " Combined Views Loaded.");
  }

  public has(id: string): boolean {
    return this.combinedViewsSharedMap.has(id);
  }

  public getCombinedView(
    id: string
  ): CombinedView | SingleCombinedView | MultiCombinedView {
    const cv = this.combinedViews.get(id);
    if (cv instanceof SingleCombinedView) return cv as SingleCombinedView;
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

import { SharedCell } from "@fluidframework/cell";
import { FactoriesManager } from "../managers/FactoriesManager";
import { MultiCombinedView } from "./multi-combined-view/MultiCombinedView";
import { SingleCombinedView } from "./single-combined-view/SingleCombinedView";

import { StitchingCombinedView } from "./stitching-combined-view/StitchingCombinedView";

export class CombinedViewFactory {
  public getCombinedView(cv: SharedCell, factoriesManager: FactoriesManager) {
    const type = cv.get().type;
    switch (type) {
      case "single":
        return new SingleCombinedView(cv, factoriesManager);
      case "stitching":
        return new StitchingCombinedView(cv, factoriesManager);
      case "multi":
        return new MultiCombinedView(cv, factoriesManager);
      default:
        return new MultiCombinedView(cv, factoriesManager);
    }
  }
}

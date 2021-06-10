import { SharedCell } from "@fluidframework/cell";
import { FactoriesManager } from "../../FactoriesManager";
import { SingleCombinedView } from "../single-combined-view/SingleCombinedView";
import { IStitchingCombinedView } from "./IStitchingCombinedView";

export class StitchingCombinedView extends SingleCombinedView {
  public constructor(
    protected readonly combinedView: SharedCell,
    protected readonly factoriesManager: FactoriesManager
  ) {
    super(combinedView, factoriesManager);
  }

  toCombinedView(): IStitchingCombinedView {
    const cell = this.combinedView.get();
    return {
      id: cell.id,
      type: cell.type,
      color: cell.color,
      view: cell.view,
      columns: cell.columns,
      rows: cell.rows,
      positions: cell.positions,
    };
  }

  public getStartingPositionFrom(
    role: string
  ): { startingX: number; startingY: number } {
    const position = this.getCombinedView().positions[role];
    const nRows = this.getCombinedView().rows;
    const nColumns = this.getCombinedView().columns;

    let currentPos = 0;

    if (nRows === 0 || nColumns === 0) return { startingX: 0, startingY: 0 };

    for (let column = 0; column < nColumns; column++) {
      for (let row = 0; row < nRows; row++) {
        currentPos++;

        if (currentPos == position)
          return {
            startingX: row * this.calculateGridItemWidth(),
            startingY: column * this.calculateGridItemHeight(),
          };
      }
    }

    return { startingX: 0, startingY: 0 };
  }

  public calculateGridItemWidth(): number {
    const viewWidth = this.view.getRows();
    const nRows = this.getCombinedView().rows;
    // const nItems = Object.keys(this.getCombinedView().positions).length;

    if (nRows === 0) return 0;
    return Math.ceil(viewWidth / nRows);
  }

  public calculateGridItemHeight() {
    const viewHeight = this.view.getColumns();
    const nColumns = this.getCombinedView().columns;
    // const nItems = Object.keys(this.getCombinedView().positions).length;
    if (nColumns === 0) return 0;
    return Math.ceil(viewHeight / nColumns);
  }

  /*
  public get startingPosition(): { startingX: number; startingY: number } {
    const index = this.views.indexOf(this.role);

    let startingX = 0;
    let startingY = 0;

    for (let i = 0; i < index; i++) {
      if (i > 0 && i % this.rowSize == 0) {
        // Next column
        startingX = 0;
        startingY -= 460; // Combined view height
      } else {
        // Next row
        startingX -= 460;
      }
    }
    return { startingX: startingX, startingY: startingY };
  }*/
}

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

  hasPosition(position: number) {
    const cell = this.combinedView.get();
    let positions = cell.positions;
    let result = false;
    Object.keys(positions).forEach((p) => {
      if (positions[p] === position) {
        result = true;
      }
    });

    return result;
  }

  hasRight(role: string) {
    const cell = this.combinedView.get();
    let positions = cell.positions;
    return this.hasPosition(positions[role] + 1);
  }

  hasBottom(role: string) {
    const cell = this.combinedView.get();
    let positions = cell.positions;
    return this.hasPosition(positions[role] + cell.rows);
  }

  hasTop(role: string) {
    const cell = this.combinedView.get();
    let positions = cell.positions;
    return this.hasPosition(positions[role] - cell.rows);
  }

  stitchRight(role: string, sourceRole: string) {
    const cell = this.combinedView.get();
    let positions = cell.positions;
    console.log({ text: "Previous", positions });
    if (positions[sourceRole] === undefined) {
      positions[sourceRole] = 0;
    }
    positions[role] = positions[sourceRole] + 1;
    console.log({ text: "After", positions });
    this.combinedView.set({
      ...cell,
      rows: cell.rows + 1,
      positions: positions,
    });
  }

  stitchLeft(role: string, sourceRole: string) {
    const cell = this.combinedView.get();
    let positions = cell.positions;
    if (positions[sourceRole] === undefined) {
      positions[sourceRole] = 0;
    }
    Object.keys(positions).forEach((p) => positions[p]++);
    positions[role] = positions[sourceRole] - 1;
    this.combinedView.set({
      ...cell,
      rows: cell.rows + 1,
      positions: positions,
    });
  }

  stitchTop(role: string, sourceRole: string) {
    const cell = this.combinedView.get();
    let positions = cell.positions;
    Object.keys(positions).forEach((p) => (positions[p] += cell.rows));
    positions[role] = positions[sourceRole] - cell.rows;

    let newColumns = cell.columns;
    if (positions[sourceRole] > cell.rows * cell.columns) newColumns++;

    this.combinedView.set({
      ...cell,
      columns: newColumns,
      positions: positions,
    });
  }

  stitchBottom(role: string, sourceRole: string) {
    const cell = this.combinedView.get();
    let positions = cell.positions;

    positions[role] = positions[sourceRole] + cell.rows;

    let newColumns = cell.columns;
    if (positions[role] > cell.rows * cell.columns) newColumns++;

    this.combinedView.set({
      ...cell,
      columns: newColumns,
      positions: positions,
    });
  }

  getColumns(): number {
    return this.combinedView.get().columns;
  }

  getRows(): number {
    return this.combinedView.get().rows;
  }

  getPosition(role: string): number {
    return this.combinedView.get().positions[role];
  }

  getPositions() {
    return this.combinedView.get().positions;
  }

  public getStartingPositionFrom(role: string): {
    startingX: number;
    startingY: number;
  } {
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

import { ISingleViewCombinedView } from "../single-combined-view";

export interface IStitchingCombinedView extends ISingleViewCombinedView {
  columns: number;
  rows: number;
  positions: PositionMap;
}

export type PositionMap = { [role: string]: number };

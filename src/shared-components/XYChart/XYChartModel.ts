import { IUIComponent } from "../UIComponent/UIComponentModel";

export interface XYChartModel extends IUIComponent {
  type: "barSeries" | "areaSeries" | "areaStack" | "lineSeries" | "glyphSeries";
  color: string[];
  stock: "microsoft" | "apple" | "amazon" | "all";
  xDomain: [string, string];
  yDomain: [string, string];
  xVariable:
    | "Date"
    | "Open"
    | "High"
    | "Low"
    | "Close"
    | "Volume"
    | "Ex-Dividend"
    | "Split Ratio"
    | "Adj. Open"
    | "Adj. High"
    | "Adj. Low"
    | "Adj. Close"
    | "Adj. Volume";

  yVariable:
    | "Date"
    | "Open"
    | "High"
    | "Low"
    | "Close"
    | "Volume"
    | "Ex-Dividend"
    | "Split Ratio"
    | "Adj. Open"
    | "Adj. High"
    | "Adj. Low"
    | "Adj. Close"
    | "Adj. Volume";
}

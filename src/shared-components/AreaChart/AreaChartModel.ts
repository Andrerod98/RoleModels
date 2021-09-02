import { IUIComponent } from "../UIComponent/UIComponentModel";

export interface AreaChartModel extends IUIComponent {
  color: string;
  currentStock: string;
  indicator: string;
}

import { IUIComponent } from "../UIComponent/UIComponentModel";

export interface BrushChartModel extends IUIComponent {
  color: string;
  currentStock: string;
  xName: string;
  yName: string;
}

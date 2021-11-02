import { IUIComponent } from "../UIComponent/UIComponentModel";

export interface BrushChart2Model extends IUIComponent {
  stock: "microsoft" | "apple" | "amazon" | "all";
  color: string;
}

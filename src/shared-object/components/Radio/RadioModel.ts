import { IUIComponent } from "../UIComponent/UIComponentModel";

export interface RadioUI extends IUIComponent {
  label: string;
  values: string[];
}

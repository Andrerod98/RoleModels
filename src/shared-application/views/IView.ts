import { IUIComponent } from "../../shared-components/UIComponent/UIComponentModel";

export interface IView {
  id: string;
  root: IUIComponent;
}

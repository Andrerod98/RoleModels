import { IUIComponent } from "../components/UIComponent/UIComponentModel";

export interface IView {
  id: string;
  combinedViewID: string;
  root: IUIComponent;
}

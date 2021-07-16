import { IUIComponent } from "../components/UIComponent/UIComponentModel";

export interface IView {
  id: string;
  root: IUIComponent;
}

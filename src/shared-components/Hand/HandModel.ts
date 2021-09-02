import { IUIComponent } from "../UIComponent/UIComponentModel";

export interface HandModel extends IUIComponent {
  cards: string[];
  flipped?: boolean;
}

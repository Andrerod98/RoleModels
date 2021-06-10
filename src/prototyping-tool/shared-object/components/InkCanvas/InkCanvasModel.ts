import { IUIComponent } from "../UIComponent/UIComponentModel";
import { IColor } from "@fluidframework/ink";

export interface InkCanvasUI extends IUIComponent {
  color: IColor;
  thickness: number;
}

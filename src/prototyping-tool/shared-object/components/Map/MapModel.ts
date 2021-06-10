import { IUIComponent } from "../UIComponent/UIComponentModel";

export interface MapUI extends IUIComponent {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  type: string;
}

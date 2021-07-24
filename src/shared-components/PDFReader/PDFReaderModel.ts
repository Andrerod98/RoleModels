import { IUIComponent } from "../UIComponent/UIComponentModel";

export interface PDFReaderUI extends IUIComponent {
  page: number;
  url: string;
}

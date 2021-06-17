import { IView } from "../views/IView";

export interface IRole {
  name: string;
  views: IView[];
  combinedViewsIds: string[];
  qrIds: string[];
}

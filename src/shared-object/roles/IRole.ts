import { IView } from "../views/IView";
import { ILayoutNode } from "./ILayout";

export interface IRole {
  name: string;
  views: IView[];
  combinedViewsIds: string[];
  qrIds: string[];
  layout: ILayoutNode;
}

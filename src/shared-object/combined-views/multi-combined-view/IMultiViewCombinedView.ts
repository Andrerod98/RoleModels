import { IView } from "../../views/IView";
import { ICombinedView } from "../combined-view/ICombinedView";

export interface IMultiViewCombinedView extends ICombinedView {
  roleMap: RoleMap;
}

export type RoleMap = { [id: string]: IView };

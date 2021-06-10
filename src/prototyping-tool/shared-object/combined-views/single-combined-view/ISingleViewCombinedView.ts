import { IView } from "../../views/IView";
import { ICombinedView } from "../combined-view/ICombinedView";

export interface ISingleViewCombinedView extends ICombinedView {
  view: IView;
}

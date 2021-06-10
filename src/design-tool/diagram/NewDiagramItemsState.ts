import { Action, InputType } from "@projectstorm/react-canvas-core";
import {
  DiagramEngine,
  LinkModel,
  PointModel,
  PortModel,
} from "@projectstorm/react-diagrams";
import * as _ from "lodash";
import { NewMoveItemsState } from "./NewMoveItemsState";

export class NewDiagramItemsState extends NewMoveItemsState<DiagramEngine> {
  constructor() {
    super();
    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: (event: any) => {
          const item = this.engine.getMouseElement(event.event);
          if (item instanceof PortModel) {
            _.forEach(this.initialPositions, (position) => {
              if (position.item instanceof PointModel) {
                const link = position.item.getParent() as LinkModel;

                // only care about the last links
                if (link.getLastPoint() !== position.item) {
                  return;
                }
                if (link.getSourcePort().canLinkToPort(item)) {
                  link.setTargetPort(item);
                  item.reportPosition();
                  this.engine.repaintCanvas();
                }
              }
            });
          }
        },
      })
    );
  }
}

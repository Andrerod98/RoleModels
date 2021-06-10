import {
  CanvasEngine,
  AbstractDisplacementStateEvent,
  AbstractDisplacementState,
  BasePositionModel,
  BaseModel,
  InputType,
  State,
  Action,
} from "@projectstorm/react-canvas-core";
import { Point } from "@projectstorm/geometry";
export class NewMoveItemsState<
  E extends CanvasEngine = CanvasEngine
> extends AbstractDisplacementState<E> {
  initialPositions: {
    [id: string]: {
      point: Point;
      item: BaseModel;
    };
  };
  constructor() {
    super({
      name: "move-items",
    });
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (event: any) => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);
          if (!element) {
            return;
          }
          if (!element.isSelected()) {
            this.engine.getModel().clearSelection();
          }
          element.setSelected(true);
          this.engine.repaintCanvas();
        },
      })
    );

    this.initialPositions = {};
  }

  activated(previous: State) {
    super.activated(previous);
    this.initialPositions = {};
  }

  fireMouseMoved(event: AbstractDisplacementStateEvent) {
    const items = this.engine.getModel().getSelectedEntities();
    const model = this.engine.getModel();
    console.log("TESTEEEEEEEE");
    for (const item of items) {
      if (item instanceof BasePositionModel) {
        if (!this.initialPositions[item.getID()]) {
          this.initialPositions[item.getID()] = {
            point: item.getPosition(),
            item: item,
          };
        }

        const pos = this.initialPositions[item.getID()].point;
        item.setPosition(
          model.getGridPosition(pos.x + event.virtualDisplacementX),
          model.getGridPosition(pos.y + event.virtualDisplacementY)
        );
      }
    }
    this.engine.repaintCanvas();
  }
}

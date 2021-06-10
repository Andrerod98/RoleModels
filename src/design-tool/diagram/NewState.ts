import { State, DragCanvasState } from "@projectstorm/react-canvas-core";
import {
  DiagramEngine,
  DragNewLinkState,
  PortModel,
} from "@projectstorm/react-diagrams";
import {
  SelectingState,
  Action,
  InputType,
} from "@projectstorm/react-canvas-core";
import { NewDiagramItemsState } from "./NewDiagramItemsState";
export class NewDiagramState extends State<DiagramEngine> {
  dragCanvas: DragCanvasState;
  dragNewLink: DragNewLinkState;
  dragItems: NewDiagramItemsState;

  constructor() {
    super({
      name: "new-diagrams",
    });
    this.childStates = [new SelectingState()];
    this.dragCanvas = new DragCanvasState();
    this.dragNewLink = new DragNewLinkState();
    this.dragItems = new NewDiagramItemsState();

    // determine what was clicked on
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (event: any) => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);

          // the canvas was clicked on, transition to the dragging canvas state
          if (!element) {
            this.transitionWithEvent(this.dragCanvas, event);
          }
          // initiate dragging a new link
          else if (element instanceof PortModel) {
            this.transitionWithEvent(this.dragNewLink, event);
          }
          // move the items (and potentially link points)
          else {
            this.transitionWithEvent(this.dragItems, event);
          }
        },
      })
    );
  }
}

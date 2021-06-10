import { IInk } from "@fluidframework/ink";
import { InkCanvasController } from ".";
import { UIComponentFactory } from "../UIComponent";
import { InkCanvasUI } from "./InkCanvasModel";

export class InkCanvasFactory extends UIComponentFactory {
  constructor(readonly name: string, readonly ink: IInk) {
    super(name);
  }

  public generateComponent(component: InkCanvasUI) {
    return new InkCanvasController(component, this.ink);
  }
}

import { SharedCell } from "@fluidframework/cell";
import EventEmitter from "events";
import { PrototypingToolDataObject } from "../PrototypingToolDataObject";

enum InteractionsManagerEvents {
  ChangeState = "changeState",
}

export class InteractionsManager extends EventEmitter {
  constructor(
    readonly app: PrototypingToolDataObject,
    readonly interactions: SharedCell
  ) {
    super();
    this.setEventListeners();
  }

  private setEventListeners() {
    this.interactions.on("valueChanged", () => {
      this.runInteractions();
    });
  }

  public getInteractions() {
    return this.interactions.get();
  }

  public setInteractions(inter: string) {
    if (inter !== this.interactions.get()) this.interactions.set(inter);
  }

  public runInteractions() {
    const app = this.app;
    console.log(app);
    eval(this.interactions.get());
    this.emitChange();
  }

  private emitChange(message?: string) {
    this.emit(InteractionsManagerEvents.ChangeState, message);
  }
}

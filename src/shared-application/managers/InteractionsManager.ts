import { SharedMap } from "@fluidframework/map";
import EventEmitter from "events";

enum InteractionsManagerEvents {
  ChangeState = "changeState",
}

export interface IInteraction {
  name: string;
  active: boolean;
  code: string;
}

export class InteractionsManager extends EventEmitter {
  constructor(readonly interactionsMap: SharedMap) {
    super();
    this.setEventListeners();
  }

  private setEventListeners() {
    this.interactionsMap.on("valueChanged", () => {
      this.emitChange();
    });
  }

  public getInteractions() {
    return this.interactionsMap.values();
  }

  public getInteraction(key: string) {
    return this.interactionsMap.get(key);
  }

  public renameInteraction(oldValue: string, newValue: string) {
    this.interactionsMap.set(newValue, {
      ...this.interactionsMap.get(oldValue),
      name: newValue,
    });
    this.interactionsMap.delete(oldValue);
    this.emitChange();
  }

  public deleteInteraction(key: string) {
    return this.interactionsMap.delete(key);
  }

  public setInteraction(key: string, interaction: IInteraction) {
    return this.interactionsMap.set(key, interaction);
  }

  private emitChange(message?: string) {
    this.emit(InteractionsManagerEvents.ChangeState, message);
  }
}

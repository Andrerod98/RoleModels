import { SharedCell } from "@fluidframework/cell";
export abstract class CombinedView {
  public constructor(protected readonly combinedView: SharedCell) {}

  public getId() {
    return this.combinedView.get().id;
  }

  public setColor(color: string) {
    this.combinedView.set({
      ...this.combinedView.get(),
      color: color,
    });
  }

  public onChange(listener: () => void) {
    this.combinedView.on("valueChanged", listener);

    // this.combinedView.on("valueChanged", listener);
  }

  /* Returns the combined view shared object */
  public getCombinedView(): any {
    return this.combinedView.get();
  }

  /* Returns true if it is a single view combined view manager e.g Mirror or Stitch */
  public abstract isSingleView(): boolean;

  /* Returns true if it is a multi view combined view manager e.g Alternate or Overview+Details */
  public abstract isMultiView(): boolean;

  public abstract updateObjects(): void;

  /* Sends an event through the combined view */
  public sendEvent(eventName: string, value: any) {
    this.combinedView.emit(eventName, value);
  }
}

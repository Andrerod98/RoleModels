import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { SharedCell } from "@fluidframework/cell";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { Ink } from "@fluidframework/ink";
import { SharedMap } from "@fluidframework/map";
import {
  IPrototypingToolInitialState,
  PrototypingToolDataObject,
  PrototypingToolInstantiationFactory,
} from "./PrototypingToolDataObject";

export class DefaultDataObject extends DataObject {
  private prototypingTool: PrototypingToolDataObject;

  private isFirst = false;

  protected async initializingFirstTime() {
    this.isFirst = true;
  }

  protected async hasInitialized() {
    /* Has initialized...*/
    if (!this.isFirst)
      this.prototypingTool = await this.root
        .get<IFluidHandle<PrototypingToolDataObject>>("prototyping-tool")
        .get();
  }

  public async createPrototypingTool(props?: IPrototypingToolInitialState) {
    // Create a new todo item
    const object = await PrototypingToolInstantiationFactory.createChildInstance(
      this.context,
      props
    );

    this.root.set("prototyping-tool", object.handle);
    this.prototypingTool = await this.root
      .get<IFluidHandle<PrototypingToolDataObject>>("prototyping-tool")
      .get();
  }

  public getPrototypingTool() {
    return this.prototypingTool;
  }
}

export const DefaultInstantiationFactory = new DataObjectFactory<
  DefaultDataObject,
  undefined,
  undefined,
  undefined
>(
  DefaultDataObject.name,
  DefaultDataObject,
  [SharedMap.getFactory(), SharedCell.getFactory(), Ink.getFactory()],
  {},
  new Map([PrototypingToolInstantiationFactory.registryEntry])
);

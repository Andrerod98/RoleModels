import { SharedMap } from "@fluidframework/map";
import { SharedCell } from "@fluidframework/cell";
import { FactoriesManager } from "./FactoriesManager";
import EventEmitter from "events";
import { Container } from "../containers/Container";
import { InteractionsManager } from "./InteractionsManager";
import { RoleModelsDataObject } from "../shared-object/RoleModelsDataObject";
import { Logger } from "../Logger";

enum ViewsManagerEvents {
  ChangeState = "changeState",
}

/* This class is responsible for managing the views */
export class ContainersManager extends EventEmitter {
  private containers: Map<String, Container>;
  private lastCommit: number;

  public constructor(
    private readonly containersSharedMap: SharedMap,
    private readonly factoriesManager: FactoriesManager,
    private readonly interactionsManager: InteractionsManager,
    private readonly app: RoleModelsDataObject
  ) {
    super();
    this.containers = new Map<String, Container>();
    this.lastCommit = 0;
    this.setEventListener();
  }

  /* Defines the event listeners needed */
  private setEventListener() {
    this.containersSharedMap.on("valueChanged", async () => {
      this.lastCommit++;
      await this.loadContainers(this.lastCommit);
      this.emitChange();
    });
  }

  /* Loads the combined views from the shared combined views map */
  public async loadContainers(commit: number) {
    const promises = [];
    for (const handle of this.containersSharedMap.values()) {
      promises.push(handle.get());
    }

    const combinedViews = await Promise.all(promises);

    if (this.lastCommit > commit) {
      return;
    }
    const newCVS = new Map<string, Container>();
    combinedViews.forEach((combinedView) => {
      if (combinedView) {
        const cv = this.loadContainer(combinedView);
        newCVS.set(cv.getId(), cv);
      }
    });

    this.containers = newCVS;
    Logger.getInstance().info(
      `${this.containersSharedMap.size} containers loaded.`
    );
    console.log(this.containersSharedMap.size + " containers loaded.");
  }

  public removeAllContainers() {
    this.containersSharedMap.clear();
    this.containers.clear();
  }

  /* Load a combined view from the shared combined view */
  public loadContainer(sharedContainer: SharedCell): Container {
    const viewValue = sharedContainer.get();
    let view: Container;
    if (this.containers.has(viewValue.id)) {
      view = this.containers.get(viewValue.id);
      view.update(viewValue);
    } else {
      view = Container.from(sharedContainer, this.factoriesManager);

      this.containers.set(view.getId(), view);
    }
    sharedContainer.off("valueChanged", () => {
      this.emitChange("Cell of " + viewValue.name + " changed.");
    });
    sharedContainer.on("valueChanged", () => {
      this.emitChange("Cell of " + viewValue.name + " changed.");
    });

    sharedContainer.off(
      "componentEvent",
      (eventName: string, componentId: string, args) => {
        const interaction = this.interactionsManager.getInteraction(
          sharedContainer.get().id + "/" + componentId + "/" + eventName
        );
        if (interaction && interaction.active) {
          // @ts-ignore
          const app = this.app;
          const view = this.getContainer(sharedContainer.get().id);
          // @ts-ignore
          const component = view.getRoot().getChildByID(componentId);

          eval(interaction.code);
        }
      }
    );

    sharedContainer.on(
      "componentEvent",
      (eventName: string, componentId: string, args) => {
        const interaction = this.interactionsManager.getInteraction(
          sharedContainer.get().id + "/" + componentId + "/" + eventName
        );
        if (interaction && interaction.active) {
          // @ts-ignore
          const app = this.app;
          const view = this.getContainer(sharedContainer.get().id);
          // @ts-ignore
          const component = view!.getRoot().getChildByID(componentId);

          eval(interaction.code);
        }
      }
    );

    return view;
  }

  /* GETTERS */

  /* Returns all the combined views */
  public getContainers(): IterableIterator<Container> {
    return this.containers.values();
  }

  /* Returns all the combined views with ids */
  public getContainersByIds(containersIDs: string[]): Container[] {
    const result = [];
    containersIDs.forEach((id) => {
      const view = this.containers.get(id);
      if (view) result.push(view);
    });
    return result;
  }

  /* Get a combined view by id */
  public getContainer(containerID: string): Container {
    const view = this.containers.get(containerID);
    if (!view) {
      Logger.getInstance().error(
        `The view with id ${containerID} was not found.`
      );
    }

    return view;
  }

  /* Checks if the combined view exists */
  public hasContainer(viewId: string): boolean {
    return this.containersSharedMap.has(viewId);
  }

  /* Removes a combined view */
  public removeContainer(containerID: string): void {
    this.containers.delete(containerID);
    this.containersSharedMap.delete(containerID);
    Logger.getInstance().info(
      `A view with id ${containerID} has been removed.`
    );
  }

  /*
   * Adds a combined view to the combined views map and combined views shared map
   */
  public addContainer(sharedContainer: SharedCell): Container {
    const sharedViewValue = sharedContainer.get();
    const id = sharedViewValue.id;
    if (this.containersSharedMap.has(id)) {
      Logger.getInstance().error("The view " + id + " already exists.");
      return;
    }

    /* Insert in shared map */
    this.containersSharedMap.set(id, sharedContainer.handle);

    /* Get Combined View */
    const view = Container.from(sharedContainer, this.factoriesManager);

    this.containers.set(id, view);

    Logger.getInstance().info(`A view with id ${id} has been added.`);

    return view;
  }

  /* Callback functions */

  private emitChange(message?: string) {
    this.emit(ViewsManagerEvents.ChangeState, message);
  }
}

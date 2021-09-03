import { SharedCell } from "@fluidframework/cell";
import { SharedMap } from "@fluidframework/map";
import EventEmitter from "events";
import { uuid } from "uuidv4";
import { ILayoutNode } from "../roles/ILayoutNode";
import { LayoutNode } from "../roles/Layout";

enum ConfigurationsManagerEvents {
  ChangeState = "changeState",
}

export interface IConfiguration {
  id: string;
  name: string;
  layouts: { [role: string]: ILayoutNode };
}
export interface Configuration {
  id: string;
  name: string;
  layouts: { [role: string]: LayoutNode };
}

/* This class is responsible for managing the combined views */
export class ConfigurationsManager extends EventEmitter {
  current: Configuration;
  primary: LayoutNode;
  public constructor(
    private readonly configurationsSharedMap: SharedMap,
    private readonly currentConfiguration: SharedCell,
    private readonly primaryConfiguration: SharedCell
  ) {
    super();

    this.setEventListeners();
  }

  private setEventListeners() {
    this.currentConfiguration.on("valueChanged", () => {
      this.loadObject();
      this.emitChange();
    });

    this.primaryConfiguration.on("valueChanged", () => {
      this.loadPrimaryObject();
      this.emitChange();
    });

    this.configurationsSharedMap.on("valueChanged", () => {
      this.emitChange();
    });
  }

  public loadPrimaryObject() {
    const primaryConfigValue = this.primaryConfiguration.get();
    this.primary = new LayoutNode(primaryConfigValue);
    this.primary.getRoot().on("change", (l) => {
      this.primaryConfiguration.set(l);
    });
  }

  public loadObject() {
    const currentConfigValue = this.currentConfiguration.get();

    const currentConfigKeys = Object.keys(currentConfigValue.layouts);

    if (this.current) {
      const currentKeys = Object.keys(this.current.layouts);

      for (const key of currentKeys) {
        this.current.layouts[key].removeAllListeners();
      }
    }

    this.current = {
      id: currentConfigValue.id,
      name: currentConfigValue.name,
      layouts: {},
    };

    for (const key of currentConfigKeys) {
      const layoutValue = currentConfigValue.layouts[key];
      this.current.layouts[key] = new LayoutNode(layoutValue);
      this.current.layouts[key].getRoot().on("change", (l) => {
        this.updateCurrent(key, l);
      });
    }
  }

  public updateCurrent(role: string, value: ILayoutNode) {
    const configValue = this.currentConfiguration.get();
    configValue.layouts[role] = value;

    this.currentConfiguration.set(configValue);
  }

  public renameConfiguration(id: string, oldValue: string, newValue: string) {
    if (this.current.name === oldValue) {
      const configValue = this.currentConfiguration.get();
      this.currentConfiguration.set({ ...configValue, name: newValue });
    }
    this.configurationsSharedMap.set(id, {
      ...this.configurationsSharedMap.get(id),
      name: newValue,
    });
    this.emitChange();
  }

  public removeViewFromRole(roleId: string, viewId: string) {
    console.log(this.current.layouts);
    const containerId = this.current.layouts[roleId]
      .getChildByViewId(viewId)
      .getId();
    let test = this.current.layouts[roleId];
    test.removeChild(containerId);
    console.log(test.toLayout());
    this.updateCurrent(roleId, test.toLayout());
  }
  /* GETTERS */
  public getLayoutWithView(viewId: string): LayoutNode {
    const keys = Object.values(this.current.layouts);
    for (const layout of keys) {
      const child = layout.getChildByViewId(viewId);
      if (child) return child;
    }

    return undefined;
  }

  /* Returns all the combined views */
  public getConfigurations(): IterableIterator<IConfiguration> {
    return this.configurationsSharedMap.values();
  }

  public getCurrentConfiguration(): Configuration {
    return this.current;
  }

  public getPrimaryConfiguration(): LayoutNode {
    return this.primary;
  }

  public getCurrentConfigurationShared(): IConfiguration {
    return this.currentConfiguration.get();
  }

  public getPrimaryConfigurationShared(): ILayoutNode {
    return this.primaryConfiguration.get();
  }

  public getCurrentConfigurationOfRole(role: string): LayoutNode {
    return this.current.layouts[role];
  }

  public loadConfiguration(configurationId: string): void {
    const config = this.configurationsSharedMap.get(configurationId);
    if (config) {
      this.currentConfiguration.set({ ...config });
    }
  }

  public deleteConfigurationWithId(configurationId: string): void {
    this.configurationsSharedMap.delete(configurationId);
  }

  public saveConfiguration() {
    const id = uuid();
    const value = Object.assign({}, this.currentConfiguration.get());
    this.currentConfiguration.set({
      ...value,
      id: id,
      name: "name",
    });
    const layouts = Object.assign({}, value.layouts);
    this.configurationsSharedMap.set(id, {
      id,
      name: "name",
      layouts: layouts,
    });
  }

  public resetConfiguration() {
    const layouts = { ...this.currentConfiguration.get().layouts };

    const keys = Object.keys(layouts);
    let i = 0;
    for (const key of keys) {
      if (i === 0) {
        layouts[key] = { ...this.primaryConfiguration.get() };
      } else {
        layouts[key] = {
          id: uuid(),
          name: "div",
        };
      }

      i++;
    }

    this.currentConfiguration.set({
      ...this.currentConfiguration.get(),
      layouts: { ...layouts },
    });
  }

  /* Callback functions */

  private emitChange(message?: string) {
    this.emit(ConfigurationsManagerEvents.ChangeState, message);
  }
}

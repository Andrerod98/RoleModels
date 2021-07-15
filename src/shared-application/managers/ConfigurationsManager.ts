import { SharedCell } from "@fluidframework/cell";
import { SharedMap } from "@fluidframework/map";
import EventEmitter from "events";
import { uuid } from "uuidv4";
import { ILayoutNode } from "../roles/ILayout";
import { LayoutNode } from "../roles/Layout";

enum ConfigurationsManagerEvents {
  ChangeState = "changeState",
}

export interface IConfiguration {
  name: string;
  layouts: { [role: string]: ILayoutNode };
}
export interface Configuration {
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
    this.current = { name: "default", layouts: {} };
    this.primary = undefined;
    //this.loadObject();
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

    const currentKeys = Object.keys(this.current.layouts);

    for (const key of currentKeys) {
      this.current.layouts[key].removeAllListeners();
    }
    this.current = { name: currentConfigValue.name, layouts: {} };

    for (const key of currentConfigKeys) {
      const layoutValue = currentConfigValue.layouts[key];
      this.current.layouts[key] = new LayoutNode(layoutValue);
      this.current.layouts[key].getRoot().on("change", (l) => {
        this.updateCurrent(key, l);
      });
    }
  }
  /* GETTERS */

  public updateCurrent(role: string, value: ILayoutNode) {
    const configValue = this.currentConfiguration.get();
    configValue.layouts[role] = value;

    this.currentConfiguration.set(configValue);
  }

  public renameConfiguration(oldValue: string, newValue: string) {
    if (this.current.name === oldValue) {
      const configValue = this.currentConfiguration.get();
      this.currentConfiguration.set({ ...configValue, name: newValue });
    }
    this.configurationsSharedMap.set(newValue, {
      ...this.configurationsSharedMap.get(oldValue),
      name: newValue,
    });
    this.configurationsSharedMap.delete(oldValue);
    this.emitChange();
  }

  public removeViewFromRole(role: string, viewId: string) {
    const node = this.current.layouts[role].getChildByViewId(viewId);
    if (node) {
      node.removeChild(node.getId());
    }
  }

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

  public loadConfiguration(configurationName: string): void {
    const config = this.configurationsSharedMap.get(configurationName);
    if (config) {
      this.currentConfiguration.set({ ...config });
    }
  }

  public saveConfiguration() {
    const name = uuid();
    this.currentConfiguration.set({
      ...this.currentConfiguration.get(),
      name: name,
    });

    this.configurationsSharedMap.set(name, {
      name,
      layouts: { ...this.currentConfiguration.get().layouts },
    });
  }

  public resetConfiguration() {
    //TODO
  }

  /* Callback functions */

  private emitChange(message?: string) {
    this.emit(ConfigurationsManagerEvents.ChangeState, message);
  }
}

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
  public constructor(
    private readonly configurationsSharedMap: SharedMap,
    private readonly currentConfiguration: SharedCell
  ) {
    super();
    this.current = { name: "default", layouts: {} };
    //this.loadObject();
    this.setEventListeners();
  }

  private setEventListeners() {
    this.currentConfiguration.on("valueChanged", () => {
      this.loadObject();
      this.emitChange();
    });

    this.configurationsSharedMap.on("valueChanged", () => {
      this.emitChange();
    });
  }

  public loadObject() {
    const currentConfigValue = this.currentConfiguration.get();

    console.trace("loading object");
    console.log(currentConfigValue);

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
        console.trace("Updating" + key + " layout with:");
        console.log(l);
        console.log(l.toLayout());
        this.updateCurrent(key, l.toLayout());
      });
    }
  }
  /* GETTERS */

  public updateCurrent(role: string, value: ILayoutNode) {
    const configValue = this.currentConfiguration.get();
    console.log("Updating layout of" + role + " with the value ");
    console.log(value);
    configValue.layouts[role] = value;

    console.log("Setting ");
    console.log(configValue);

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
    const configValue = this.currentConfiguration.get();
    const node = this.current.layouts[role].getChildByViewId(viewId);
    if (node) {
      console.log("Removing child with id" + node.getViewId());
      node.removeChild(node.getId());

      //const layouts = { ...configValue.layouts };
      // layouts[role] = node.toLayout();
      //this.currentConfiguration.set({ ...configValue, layouts: layouts });
    }
  }

  /* Returns all the combined views */
  public getConfigurations(): IterableIterator<IConfiguration> {
    return this.configurationsSharedMap.values();
  }

  public getCurrentConfiguration(): Configuration {
    return this.current;
  }

  public getCurrentConfigurationShared(): IConfiguration {
    return this.currentConfiguration.get();
  }

  public getCurrentConfigurationOfRole(role: string): LayoutNode {
    return this.current.layouts[role];
  }

  public loadConfiguration(configurationName: string): void {
    const config = this.configurationsSharedMap.get(configurationName);
    if (config) {
      const keys = Object.keys(config.layouts);
      for (const key of keys) {
      }
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

    console.log("Saving layout:");
    console.log({ ...this.currentConfiguration.get().layouts });
  }

  /* Callback functions */

  private emitChange(message?: string) {
    this.emit(ConfigurationsManagerEvents.ChangeState, message);
  }
}

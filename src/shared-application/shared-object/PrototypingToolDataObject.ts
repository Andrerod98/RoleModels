import { IFluidHandle } from "@fluidframework/core-interfaces";
import { SharedMap } from "@fluidframework/map";
import { SharedCell } from "@fluidframework/cell";
import { SharedCounter } from "@fluidframework/counter";
import { IEvent } from "@fluidframework/common-definitions";
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IInk, Ink } from "@fluidframework/ink";
import { IPrototypingToolDataModel } from "..";
import {
  UIComponentFactory,
  RadioFactory,
  ListFactory,
  LinkFactory,
  InputFactory,
  ImageFactory,
  FlexFactory,
  MapFactory,
  CenterFactory,
  SpacerFactory,
  BoxFactory,
  StackFactory,
  GridFactory,
  CheckboxFactory,
  EditableFactory,
  SliderFactory,
  InkCanvasFactory,
  UIComponentController,
} from "../components";
import { ThrowableFactory } from "../components/Throwable";
import { IDevice } from "../devices/IDevice";
import {
  ConfigurationsManager,
  IConfiguration,
} from "../managers/ConfigurationsManager";
import { DevicesManager } from "../managers/DevicesManager";
import { FactoriesManager } from "../managers/FactoriesManager";
import {
  IInteraction,
  InteractionsManager,
} from "../managers/InteractionsManager";
import { RolesManager } from "../managers/RolesManager";
import { IRole } from "../roles/IRole";
import { Role } from "../roles/Role";
import { IView } from "../views/IView";
import { View } from "../views/View";
import { ButtonFactory } from "../components/Button";
import { uuid } from "uuidv4";
import { ViewsManager } from "../managers/ViewsManager";
import { ILayoutNode } from "../roles/ILayoutNode";
import { LayoutNode } from "../roles/Layout";
import { Logger } from "../Logger";
import { QRCodeFactory } from "../components/QRCode";
import { QuickInteraction } from "./IQuickInteraction";

export class PrototypingToolDataObject
  extends DataObject
  implements IPrototypingToolDataModel
{
  /* The Map with the connected devices */
  private devicesMap: SharedMap; // <device Id, IDevice>
  private devicesManager: DevicesManager;

  /* The Map with the roles */
  private rolesMap: SharedMap; // <role name, IView>
  private rolesManager: RolesManager;

  /* The Map with the views */
  private viewsMap: SharedMap; // <view id, IView>
  private viewsManager: ViewsManager;

  /* The Map with the configurations */
  private configurationsMap: SharedMap;
  private currentConfiguration: SharedCell;
  private primaryConfiguration: SharedCell;
  private configurationsManager: ConfigurationsManager;

  /* The Map with the interactions */
  private interactionsMap: SharedMap;
  private interactionsManager: InteractionsManager;

  private quickInteraction: SharedCell;

  /* The Manager responsible for rendering components */
  private factoriesManager: FactoriesManager;

  /* Ink */
  private ink: IInk;

  private pingCounter: SharedCounter;
  private audio;

  public static get DataObjectName() {
    return "prototyping_tool";
  }

  public getId(): string {
    return this.context.documentId;
  }

  protected async initializingFirstTime() {
    const devicesMap = SharedMap.create(this.runtime);
    const combinedViewsMap = SharedMap.create(this.runtime);
    const rolesMap = SharedMap.create(this.runtime);
    const viewsMap = SharedMap.create(this.runtime);
    const interactionsMap = SharedMap.create(this.runtime);

    const ink = Ink.create(this.runtime);

    const sharedPing = SharedCounter.create(this.runtime);

    const configurationsMap = SharedMap.create(this.runtime);
    const currentConfiguration = SharedCell.create(this.runtime);

    /* Creating default roles */
    const managerRole = SharedCell.create(this.runtime);
    const managerRoleId = uuid();
    managerRole.set({
      id: managerRoleId,
      name: "manager",
    } as IRole);

    const designerRole = SharedCell.create(this.runtime);
    const designerRoleId = uuid();
    designerRole.set({
      id: designerRoleId,
      name: "designer",
    } as IRole);

    const defaultRole = SharedCell.create(this.runtime);
    const defaultRoleId = uuid();
    defaultRole.set({
      id: defaultRoleId,
      name: "default",
    } as IRole);

    currentConfiguration.set({
      id: uuid(),
      name: "default",
      layouts: { [defaultRoleId]: { id: uuid(), name: "div" } },
    } as IConfiguration);

    const primaryConfiguration = SharedCell.create(this.runtime);
    primaryConfiguration.set({
      id: uuid(),
      name: "div",
    } as ILayoutNode);

    const quickInteraction = SharedCell.create(this.runtime);

    quickInteraction.set({
      viewId: "",
      from: "",
      fulfilled: false,
    } as QuickInteraction);

    rolesMap.set(managerRoleId, managerRole.handle);
    rolesMap.set(designerRoleId, designerRole.handle);
    rolesMap.set(defaultRoleId, defaultRole.handle);

    /* Setting shared objects in the root Map...*/
    this.root.set("devices", devicesMap.handle);
    this.root.set("roles", rolesMap.handle);
    this.root.set("views", viewsMap.handle);
    this.root.set("combined-views", combinedViewsMap.handle);
    this.root.set("ink", ink.handle);
    this.root.set("ping", sharedPing.handle);
    this.root.set("configurations", configurationsMap.handle);
    this.root.set("current-configuration", currentConfiguration.handle);
    this.root.set("primary-configuration", primaryConfiguration.handle);
    this.root.set("interactions", interactionsMap.handle);
    this.root.set("quick-interaction", quickInteraction.handle);
    Logger.getInstance().info("The application has been setup with success.");
  }

  protected async hasInitialized() {
    /* Loading shared objects...*/
    await this.loadSharedObjects();

    /* Loading managers...*/
    this.loadManagers();

    /* Registering factories...*/
    this.registerDefaultFactories();

    /* Creating event listeners...*/
    this.createAllEventListeners();

    /* Loading combined views...*/
    await Promise.all([
      this.rolesManager.loadRoles(1),
      this.configurationsManager.loadObject(),
      this.configurationsManager.loadPrimaryObject(),
      this.viewsManager.loadViews(1),
    ]);

    Logger.getInstance().success(
      "The application has been loaded with success."
    );
  }

  private async loadSharedObjects() {
    const sharedMaps = await Promise.all([
      this.root.get<IFluidHandle<SharedMap>>("devices").get(),
      this.root.get<IFluidHandle<SharedMap>>("combined-views").get(),
      this.root.get<IFluidHandle<SharedMap>>("roles").get(),
      this.root.get<IFluidHandle<SharedMap>>("configurations").get(),
      this.root.get<IFluidHandle<SharedMap>>("interactions").get(),
      this.root.get<IFluidHandle<SharedMap>>("views").get(),
    ]);

    const sharedObjects = await Promise.all([
      this.root.get<IFluidHandle<SharedCounter>>("ping").get(),
      this.root.get<IFluidHandle<SharedCell>>("current-configuration").get(),
      this.root.get<IFluidHandle<SharedCell>>("primary-configuration").get(),
      this.root.get<IFluidHandle<SharedCell>>("quick-interaction").get(),
      this.root.wait<IFluidHandle<IInk>>("ink"),
    ]);

    this.devicesMap = sharedMaps[0];
    this.rolesMap = sharedMaps[2];
    this.configurationsMap = sharedMaps[3];
    this.interactionsMap = sharedMaps[4];
    this.viewsMap = sharedMaps[5];

    this.pingCounter = sharedObjects[0];
    this.currentConfiguration = sharedObjects[1];
    this.primaryConfiguration = sharedObjects[2];
    this.quickInteraction = sharedObjects[3];
    this.ink = await sharedObjects[4].get();
  }

  private loadManagers() {
    /* Creating devices manager...*/
    this.devicesManager = new DevicesManager(this.devicesMap, this.runtime);

    /* Creating factories manager...*/
    this.factoriesManager = new FactoriesManager();

    /* Creating Roles manager...*/
    this.rolesManager = new RolesManager(this.rolesMap, this.factoriesManager);

    this.interactionsManager = new InteractionsManager(this.interactionsMap);

    /* Creating Roles manager...*/
    this.viewsManager = new ViewsManager(
      this.viewsMap,
      this.factoriesManager,
      this.interactionsManager,
      this
    );

    /* Creating configurations Manager...*/
    this.configurationsManager = new ConfigurationsManager(
      this.configurationsMap,
      this.currentConfiguration,
      this.primaryConfiguration
    );
  }

  private registerDefaultFactories() {
    this.factoriesManager.registerFactory(
      new UIComponentFactory("uicomponent", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new RadioFactory("radio", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new MapFactory("map", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new ListFactory("list", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new LinkFactory("link", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new InputFactory("input", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new ImageFactory("image", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new FlexFactory("flex", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new CenterFactory("column", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new SpacerFactory("spacer", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new BoxFactory("box", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new CenterFactory("center", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new StackFactory("stack", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new GridFactory("grid", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new CheckboxFactory("checkbox", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new EditableFactory("editable", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new SliderFactory("slider", this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new ThrowableFactory("throwable", this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new ButtonFactory("button", this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new InkCanvasFactory("ink", this.ink, this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new QRCodeFactory("qrcode", this.factoriesManager)
    );
  }

  public async createAllEventListeners() {
    this.runtime.on("connected", () => {
      this.emit("connected");
    });

    this.quickInteraction.on("valueChanged", () => {
      this.emit("change", "qi");
    });

    this.devicesMap.on("valueChanged", () => {
      this.emit("change", "Devices map changed");
    });

    this.rolesMap.on("valueChanged", () => {
      this.emit("change", "Roles map changed");
    });

    this.rolesManager.on("changeState", () => {
      this.emit("change", "Roles manager state changed.");
    });

    this.viewsManager.on("changeState", () => {
      this.emit("change", "Views manager state changed.");
    });

    this.configurationsManager.on("changeState", () => {
      this.emit("change", "Configurations manager state changed.");
    });

    this.interactionsManager.on("changeState", () => {
      this.emit("change", "Interactions manager state changed.");
    });

    this.pingCounter.on("incremented", this.playSound);
  }

  public deleteAllEventListeners() {
    this.devicesMap.removeAllListeners();
    this.rolesMap.removeAllListeners();

    this.deleteMapEventListeners("roles", this.rolesMap);
    this.deleteMapEventListeners("views", this.viewsMap);
    this.deleteMapEventListeners("configurations", this.configurationsMap);

    this.currentConfiguration.removeAllListeners();
    this.primaryConfiguration.removeAllListeners();
    this.pingCounter.removeAllListeners();
    this.runtime.off("connected", () => {
      this.emit("connected");
    });

    this.interactionsMap.removeAllListeners();

    this.rolesManager.deleteRolesEventListener();
    this.removeAllListeners();
  }

  private async deleteMapEventListeners(name: string, map: SharedMap) {
    const promises = [];
    for (const value of map.values()) {
      promises.push(value.get());
    }

    const results = await Promise.all(promises);

    for (const result of results) {
      result.removeAllListeners();
    }
  }
  /* private async createMapEventListeners(name: string, map: SharedMap) {
    const promises = [];
    for (const value of map.values()) {
      promises.push(value.get());
    }

    const results = await Promise.all(promises);

    for (const result of results) {
      result.on("valueChanged", () => {
        this.emit("change", "Cell of " + name + " changed.");
      });
    }
  }*/

  public setQuickInteraction(viewId: string, from: string) {
    this.quickInteraction.set({
      viewId: viewId,
      from: from,
      fulfilled: false,
    });
  }

  public getQuickInteraction() {
    return this.quickInteraction.get();
  }

  public pingAll() {
    this.pingCounter.increment(1);
  }

  public playSound() {
    if (!this.audio) {
      this.audio = new Audio("/public/ping.mp3");
    }

    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.play();
  }

  /* ******************************************************** 
                Device Management Functions
   ******************************************************** */

  /**
   * Get the device object for the current device.
   */
  public getDevice = (): IDevice => this.devicesManager.getMyDevice();

  /**
   * Get an array of all devices objects for the devices
   * who have joined the session (even if they have left).
   */
  public getDevices = (): IterableIterator<IDevice> =>
    this.devicesManager.getDevices();

  /**
   * Get a connected device with a role
   */
  public getDevicesByRole = (role: string): IDevice[] =>
    this.devicesManager.getDevicesWithRole(role);

  /**
   * Returns true if the current device is the manager
   */
  public isManager = (): boolean => this.devicesManager.isManager();

  /**
   * Returns true if the current device is the designer
   */
  public isDesigner = (): boolean => this.devicesManager.isDesigner();

  /**
   * Promotes the current device to the manager
   */
  public promoteToManager = (): void => {
    this.devicesManager.promoteToManager();
    Logger.getInstance().info(
      "The current device has been promoted to manager."
    );
  };

  /**
   * Promotes the current device to the designer
   */
  public promoteToDesigner = (): void => {
    this.devicesManager.promoteToDesigner();
    Logger.getInstance().info(
      "The current device has been promoted to designer."
    );
  };

  /**
   * Promotes the current device to a specific role
   */
  public promoteToRole = (role: string, deviceId?: string): void => {
    this.devicesManager.promoteToRole(role, deviceId);
    Logger.getInstance().info(
      `The device with id ${deviceId} has been promoted to ${role}.`
    );
  };

  /**
   * Updates the properties of a device
   */
  public updateDevice = (device: IDevice): void => {
    this.devicesManager.updateDevice(device);
    Logger.getInstance().info(
      `The device with id ${device.id} has been updated`
    );
  };

  /********************************************************* 
                          Ink
   *********************************************************/

  public getInk = (): IInk => this.ink;

  /* ******************************************************** 
                View Management Functions
   ******************************************************** */
  public getMyViews = (): View[] => {
    const viewsIds = this.getCurrentConfigurationOfRole(
      this.getMyRole().getId()
    ).toViewsIds();
    return this.viewsManager.getViewsByIds(viewsIds);
  };

  public getAllViews = (): IterableIterator<View> => {
    return this.viewsManager.getViews();
  };

  public getViewsFrom = (roleId: string): View[] => {
    const viewsIds = this.getCurrentConfigurationOfRole(roleId).toViewsIds();
    return this.viewsManager.getViewsByIds(viewsIds);
  };

  public getView = (viewId: string): View => {
    return this.viewsManager.getView(viewId);
  };

  public getComponentFromAllViews = (
    componentId: string
  ): UIComponentController => {
    const views = this.viewsManager.getViews();
    for (const view of views) {
      const component = view.getComponentByID(componentId);
      if (component) {
        return component;
      }
    }
  };

  public getLayoutWithView(viewId: string): LayoutNode {
    return this.configurationsManager.getLayoutWithView(viewId);
  }

  public migrateView = (view: View, from: string): void => {
    this.configurationsManager.removeViewFromRole(from, view.getId());

    Logger.getInstance().info(
      `The view with id ${view.getId()} from ${from} has been migrated.`
    );
  };

  /* Roles */
  /**
   * Get the role for the current device.
   */
  public getMyRole = (): Role => this.getRoleByName(this.getDeviceRole());

  public getRole = (roleId: string): Role => this.rolesManager.getRole(roleId);

  public getRoleByName = (roleName: string): Role =>
    this.rolesManager.getRoleByName(roleName);

  public getDeviceRole = (): string => this.devicesManager.getMyDevice().role;

  public removeRole(roleName: string) {
    this.rolesManager.removeRole(roleName);
    Logger.getInstance().info(`The role ${roleName} has been removed.`);
  }

  public renameRole(id: string, oldName: string, newName: string) {
    this.rolesManager.renameRole(id, oldName, newName);
    Logger.getInstance().info(
      `The role ${oldName} has been renamed to ${newName}.`
    );
  }

  public addRole = (role: string): Role => {
    const sharedRole = SharedCell.create(this.runtime);

    const roleId = uuid();
    console.log("Adding role " + roleId);
    sharedRole.set({
      id: roleId,
      name: role,
    } as IRole);

    const newRole = this.rolesManager.addRole(sharedRole);
    this.configurationsManager.updateCurrent(roleId, {
      id: uuid(),
      name: "div",
    });

    Logger.getInstance().info(`The role ${role} has been added.`);
    return newRole;
  };
  /**
   * Get the available roles.
   */
  public getRoles = (): IterableIterator<Role> => this.rolesManager.getRoles();

  public updateView(view: View): void {
    this.viewsManager.getView(view.getId()).update(view.toView());
  }

  public updateViews(views: View[]) {
    views.forEach((v) => {
      const view = this.viewsManager.getView(v.getId());
      if (view) view.update(v.toView());
    });
  }

  public updateIViews(views: IView[]) {
    views.forEach((v) => {
      if (this.viewsMap.has(v.id)) {
        this.viewsManager.getView(v.id).updateObject(v);
      } else {
        const sharedView = SharedCell.create(this.runtime);
        sharedView.set(v);
        sharedView.on("valueChanged", () => {
          this.emit("change");
        });

        this.viewsManager.addView(sharedView);
      }
    });
  }

  /* ******************************************************** 
                Factory Manager Management Functions
   ******************************************************** */
  public registerFactory(factory: UIComponentFactory) {
    this.factoriesManager.registerFactory(factory);
  }

  /* ******************************************************** 
                Configurations Functions
   ******************************************************** */

  public getConfigurations() {
    return this.configurationsManager.getConfigurations();
  }

  public getCurrentConfiguration() {
    return this.configurationsManager.getCurrentConfiguration();
  }

  public getCurrentConfigurationShared() {
    return this.configurationsManager.getCurrentConfigurationShared();
  }

  public getPrimaryConfiguration() {
    return this.configurationsManager.getPrimaryConfiguration();
  }

  public getPrimaryConfigurationShared() {
    return this.configurationsManager.getPrimaryConfigurationShared();
  }

  public renameConfiguration(id: string, oldValue: string, newValue: string) {
    this.configurationsManager.renameConfiguration(id, oldValue, newValue);
  }

  public getCurrentConfigurationOfRole(roleId: string) {
    return this.configurationsManager.getCurrentConfigurationOfRole(roleId);
  }

  public saveConfiguration() {
    this.configurationsManager.saveConfiguration();
  }

  public resetConfiguration() {
    this.configurationsManager.resetConfiguration();
  }

  public loadConfiguration(configId: string) {
    this.configurationsManager.loadConfiguration(configId);
  }

  public deleteConfigurationWithId(configId: string) {
    this.configurationsManager.deleteConfigurationWithId(configId);
  }

  public getInteractions() {
    return this.interactionsManager.getInteractions();
  }

  public getInteraction(key: string) {
    return this.interactionsManager.getInteraction(key);
  }

  public renameInteraction(oldValue: string, newValue: string) {
    this.interactionsManager.renameInteraction(oldValue, newValue);
  }

  public deleteInteraction(key: string) {
    return this.interactionsManager.deleteInteraction(key);
  }

  public setInteraction(key: string, interaction: IInteraction) {
    return this.interactionsManager.setInteraction(key, interaction);
  }
  /**
   * Event Listeners
   */
  onDeviceJoin(listener: () => void): this {
    throw new Error("Method not implemented.");
  }
  onDeviceLeave(listener: () => void): this {
    throw new Error("Method not implemented.");
  }
  onDeviceChanges(listener: () => void): this {
    throw new Error("Method not implemented.");
  }
  onRolesChange(listener: () => void): this {
    throw new Error("Method not implemented.");
  }
}

export const PrototypingToolInstantiationFactory = new DataObjectFactory<
  PrototypingToolDataObject,
  undefined,
  undefined,
  IEvent
>(
  PrototypingToolDataObject.name,
  PrototypingToolDataObject,
  [
    SharedMap.getFactory(),
    SharedCell.getFactory(),
    Ink.getFactory(),
    SharedCounter.getFactory(),
  ],
  []
);

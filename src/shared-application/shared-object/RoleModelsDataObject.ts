import { IFluidHandle } from "@fluidframework/core-interfaces";
import { SharedMap } from "@fluidframework/map";
import { SharedCell } from "@fluidframework/cell";
import { SharedCounter } from "@fluidframework/counter";
import { IEvent } from "@fluidframework/common-definitions";
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IInk, Ink } from "@fluidframework/ink";
import { IRoleModelsDataModel as IRoleModelsDataModel } from "..";
import {
  UIComponentFactory,
  UIComponentController,
  BoxFactory,
  MapFactory,
  CenterFactory,
  CheckboxFactory,
  EditableFactory,
  FlexFactory,
  GridFactory,
  ImageFactory,
  InkCanvasFactory,
  InputFactory,
  LinkFactory,
  ListFactory,
  RadioFactory,
  SliderFactory,
  SpacerFactory,
  StackFactory,
} from "../../shared-components";
import { IDevice } from "../devices/IDevice";
import { WorkspacesManager } from "../managers/WorkspacesManager";
import { DevicesManager } from "../managers/DevicesManager";
import { FactoriesManager } from "../managers/FactoriesManager";
import {
  IInteraction,
  InteractionsManager,
} from "../managers/InteractionsManager";
import { RolesManager } from "../managers/RolesManager";
import { IRole } from "../roles/IRole";
import { Role } from "../roles/Role";
import { IContainer } from "../containers/IContainer";
import { Container } from "../containers/Container";
import { uuid } from "uuidv4";
import { ContainersManager } from "../managers/ContainersManager";
import { LayoutNode } from "../workspaces/LayoutNode";
import { Logger } from "../Logger";
import { ButtonFactory } from "../../shared-components/Button";
import { QRCodeFactory } from "../../shared-components/QRCode";
import { AreaChartFactory } from "../../shared-components/AreaChart";
import { XYChartFactory } from "../../shared-components/XYChart";
import { BoardFactory } from "../../shared-components/Board";
import { HandFactory } from "../../shared-components/Hand";
import { TextFactory } from "../../shared-components/Text";
import { StockDetailsFactory } from "../../shared-components/StockDetails";
import { IWorkspace } from "../workspaces/IWorkspace";

export class RoleModelsDataObject
  extends DataObject
  implements IRoleModelsDataModel
{
  /* The Map with the connected devices */
  private devicesMap: SharedMap; // <device Id, IDevice>
  private devicesManager: DevicesManager;

  /* The Map with the roles */
  private rolesMap: SharedMap; // <role name, IView>
  private rolesManager: RolesManager;

  /* The Map with the views */
  private containersMap: SharedMap; // <view id, IView>
  private containersManager: ContainersManager;

  /* The Map with the configurations */
  private workspacesMap: SharedMap;

  private primaryWorkspaces: SharedMap;

  private currentWorkspace: SharedCell;
  private primaryWorkspace: SharedCell;

  private workspacesManager: WorkspacesManager;

  /* The Map with the interactions */
  private interactionsMap: SharedMap;
  private interactionsManager: InteractionsManager;

  private mode: SharedCell;

  /* The Manager responsible for rendering components */
  private factoriesManager: FactoriesManager;

  /* Ink */
  private ink: IInk;

  private pingCounter: SharedCounter;
  private audio;

  public static get DataObjectName() {
    return "role-models";
  }

  public getId(): string {
    return this.context.documentId;
  }

  protected async initializingFirstTime() {
    const devicesMap = SharedMap.create(this.runtime);
    const rolesMap = SharedMap.create(this.runtime);
    const viewsMap = SharedMap.create(this.runtime);
    const interactionsMap = SharedMap.create(this.runtime);

    const ink = Ink.create(this.runtime);

    const sharedPing = SharedCounter.create(this.runtime);

    const workspacesMap = SharedMap.create(this.runtime);
    const lastWorkspacesMap = SharedMap.create(this.runtime);
    const currentWorkspace = SharedCell.create(this.runtime);
    const primaryWorkspace = SharedCell.create(this.runtime);
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
      name: "role1",
    } as IRole);

    const currentWorkspaceValue = {
      id: uuid(),
      name: "default",
      layouts: {
        [defaultRoleId]: {
          layout: { id: uuid(), name: "div" },
          type: "",
          name: "role1",
        },
      },
    } as IWorkspace;
    currentWorkspace.set(currentWorkspaceValue);
    primaryWorkspace.set(currentWorkspaceValue);

    const mode = SharedCell.create(this.runtime);

    mode.set({
      mode: "",
      properties: {
        viewId: "",
        from: "",
        fulfilled: false,
      },
    });

    rolesMap.set(managerRoleId, managerRole.handle);
    rolesMap.set(designerRoleId, designerRole.handle);
    rolesMap.set(defaultRoleId, defaultRole.handle);

    lastWorkspacesMap.set("1", currentWorkspaceValue);

    /* Setting shared objects in the root Map...*/
    this.root.set("devices", devicesMap.handle);
    this.root.set("roles", rolesMap.handle);
    this.root.set("containers", viewsMap.handle);
    this.root.set("ink", ink.handle);
    this.root.set("ping", sharedPing.handle);
    this.root.set("workspaces", workspacesMap.handle);
    this.root.set("last-workspaces", lastWorkspacesMap.handle);
    this.root.set("current-workspace", currentWorkspace.handle);
    this.root.set("primary-workspace", primaryWorkspace.handle);
    this.root.set("interactions", interactionsMap.handle);
    this.root.set("mode", mode.handle);
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
      this.containersManager.loadContainers(1),
    ]);

    Logger.getInstance().success(
      "The application has been loaded with success."
    );
  }

  private async loadSharedObjects() {
    const sharedMaps = await Promise.all([
      this.root.get<IFluidHandle<SharedMap>>("devices").get(),
      this.root.get<IFluidHandle<SharedMap>>("roles").get(),
      this.root.get<IFluidHandle<SharedMap>>("workspaces").get(),
      this.root.get<IFluidHandle<SharedMap>>("interactions").get(),
      this.root.get<IFluidHandle<SharedMap>>("containers").get(),
      this.root.get<IFluidHandle<SharedMap>>("last-workspaces").get(),
    ]);

    const sharedObjects = await Promise.all([
      this.root.get<IFluidHandle<SharedCounter>>("ping").get(),
      this.root.get<IFluidHandle<SharedCell>>("current-workspace").get(),
      this.root.get<IFluidHandle<SharedCell>>("primary-workspace").get(),
      this.root.get<IFluidHandle<SharedCell>>("mode").get(),
      this.root.wait<IFluidHandle<IInk>>("ink"),
    ]);

    this.devicesMap = sharedMaps[0];
    this.rolesMap = sharedMaps[1];
    this.workspacesMap = sharedMaps[2];
    this.interactionsMap = sharedMaps[3];
    this.containersMap = sharedMaps[4];
    this.primaryWorkspaces = sharedMaps[5];

    this.pingCounter = sharedObjects[0];
    this.currentWorkspace = sharedObjects[1];
    this.primaryWorkspace = sharedObjects[2];
    this.mode = sharedObjects[3];
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
    this.containersManager = new ContainersManager(
      this.containersMap,
      this.factoriesManager,
      this.interactionsManager,
      this
    );

    /* Creating configurations Manager...*/
    this.workspacesManager = new WorkspacesManager(
      this,
      this.workspacesMap,
      this.primaryWorkspaces,
      this.currentWorkspace,
      this.primaryWorkspace
    );
  }

  private registerDefaultFactories() {
    this.factoriesManager.registerFactory(
      new UIComponentFactory(this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new RadioFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new MapFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new ListFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new LinkFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new InputFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new ImageFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new FlexFactory(this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new SpacerFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new BoxFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new CenterFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new StackFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new GridFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new CheckboxFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new EditableFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new SliderFactory(this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new ButtonFactory(this.factoriesManager)
    );
    this.factoriesManager.registerFactory(
      new InkCanvasFactory(this.ink, this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new QRCodeFactory(this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new AreaChartFactory(this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new XYChartFactory(this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new BoardFactory(this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new HandFactory(this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new TextFactory(this.factoriesManager)
    );

    this.factoriesManager.registerFactory(
      new StockDetailsFactory(this.factoriesManager)
    );
  }

  public async createAllEventListeners() {
    this.runtime.on("connected", () => {
      this.emit("connected");
    });

    this.mode.on("valueChanged", () => {
      this.emit("change", "mode");
    });

    this.devicesMap.on("valueChanged", () => {
      this.emit("change", "devicesMap");
    });

    this.rolesMap.on("valueChanged", () => {
      this.emit("change", "rolesMap");
    });

    this.rolesManager.on("changeState", () => {
      this.emit("change", "rolesManager");
    });

    this.containersManager.on("changeState", () => {
      this.emit("change", "containersManager");
    });

    this.workspacesManager.on("changeState", () => {
      this.emit("change", "workspacesManager");
    });

    this.interactionsManager.on("changeState", () => {
      this.emit("change", "interactionsManager");
    });

    this.runtime.on("connected", (clientId: string) => {
      this.emit("deviceConnected", "");
    });

    this.runtime.getQuorum().on("removeMember", () => {
      this.emit("deviceRemoved", "deviceRemoved");
    });

    this.pingCounter.on("incremented", this.playSound);
  }

  public deleteAllEventListeners() {
    this.devicesMap.removeAllListeners();
    this.rolesMap.removeAllListeners();

    this.deleteMapEventListeners("roles", this.rolesMap);
    this.deleteMapEventListeners("views", this.containersMap);
    this.deleteMapEventListeners("configurations", this.workspacesMap);
    this.deleteMapEventListeners("primary-workspaces", this.primaryWorkspaces);

    this.currentWorkspace.removeAllListeners();
    this.primaryWorkspace.removeAllListeners();
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

  public setMode(mode: string, properties?: any) {
    this.mode.set({
      mode: mode,
      properties: properties,
    });
  }

  public getMode() {
    return this.mode.get();
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

  public getDevicesRolesTypes = (): { [role: string]: string } =>
    this.devicesManager.getDevicesRolesTypes();

  public getDeviceTypeOfRole = (role: string): string => {
    return this.devicesManager.getDeviceTypeOfRole(role);
  };

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
  public getMyContainers = (): Container[] => {
    const viewsIds = this.getCurrentConfigurationOfRole(
      this.getMyRole().getId()
    ).toViewsIds();
    return this.containersManager.getContainersByIds(viewsIds);
  };

  public getContainers = (): IterableIterator<Container> => {
    return this.containersManager.getContainers();
  };

  public getContainersFrom = (roleId: string): Container[] => {
    const viewsIds = this.getCurrentConfigurationOfRole(roleId).toViewsIds();
    return this.containersManager.getContainersByIds(viewsIds);
  };

  public getContainer = (viewId: string): Container => {
    return this.containersManager.getContainer(viewId);
  };

  public getComponentFromAllViews = (
    componentId: string
  ): UIComponentController => {
    const views = this.containersManager.getContainers();
    for (const view of views) {
      const component = view.getComponentByID(componentId);
      if (component) {
        return component;
      }
    }
  };

  public getLayoutWithContainer(containerID: string): LayoutNode {
    return this.workspacesManager
      .getCurrentWorkspace()
      .get()
      .getLayoutWithContainer(containerID);
  }

  public migrateView = (view: Container, from: string): void => {
    this.workspacesManager.removeContainerFromRole(from, view.getId());

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

  public setRoles = (workspace: IWorkspace) => {
    for (const device of this.getDevices()) {
      this.devicesManager.promoteToRole("manager", device.id);
    }
    this.rolesManager.resetRoles();

    const roles = Object.keys(workspace.layouts);
    let resultWorkspace = { ...workspace, layouts: {} } as IWorkspace;

    for (const roleID of roles) {
      const roleName = workspace.layouts[roleID].name;
      const newRole = this.addRole(roleName);
      resultWorkspace.layouts[newRole.getId()] = {
        ...workspace.layouts[roleID],
      };
    }

    return resultWorkspace;
  };

  public restoreLastWorkspace = () => {};

  public extendWorkspace = () => {
    const myDevice = this.getDevice();

    const newRole = this.addRole(myDevice.id);
    this.devicesManager.promoteToRole(newRole.getName(), myDevice.id);
  };

  public assignRolesToDevices = (workspace: IWorkspace) => {
    const copy = Object.assign({}, workspace.layouts);
    const roles = Object.keys(workspace.layouts);

    for (const device of this.getDevices()) {
      for (const roleID of roles) {
        const type = copy[roleID].type;
        const name = copy[roleID].name;
        if (type !== "assigned") {
          if (device.type === type) {
            this.devicesManager.promoteToRole(name, device.id);
            copy[roleID].type = "assigned";
            break;
          }
        }
      }
    }
  };

  public addRole = (roleName: string, roleID?: string): Role => {
    const sharedRole = SharedCell.create(this.runtime);

    let roleId = uuid();
    if (roleID) {
      roleId = roleID;
    }

    console.log("Adding role " + roleId);
    sharedRole.set({
      id: roleId,
      name: roleName,
    } as IRole);

    const newRole = this.rolesManager.addRole(sharedRole);
    this.workspacesManager.getCurrentWorkspace().setLayout(roleId, {
      id: uuid(),
      name: "div",
      flexGrow: false,
    });

    Logger.getInstance().info(`The role ${roleName} has been added.`);
    return newRole;
  };
  /**
   * Get the available roles.
   */
  public getRoles = (): IterableIterator<Role> => this.rolesManager.getRoles();

  public updateView(view: Container): void {
    this.containersManager.getContainer(view.getId()).update(view.toView());
  }

  public updateViews(views: Container[]) {
    views.forEach((v) => {
      const view = this.containersManager.getContainer(v.getId());
      if (view) view.update(v.toView());
    });
  }

  public updateIViews(views: IContainer[]) {
    views.forEach((v) => {
      if (this.containersMap.has(v.id)) {
        this.containersManager.getContainer(v.id).updateObject(v);
      } else {
        const sharedView = SharedCell.create(this.runtime);
        sharedView.set(v);
        sharedView.on("valueChanged", () => {
          this.emit("change");
        });

        this.containersManager.addContainer(sharedView);
      }
    });
  }

  /* ******************************************************** 
                Factory Manager Management Functions
   ******************************************************** */
  public registerFactory(factory: UIComponentFactory) {
    this.factoriesManager.registerFactory(factory);
  }

  public getFactory(name: string) {
    return this.factoriesManager.getFactory(name);
  }

  public getFactories() {
    return this.factoriesManager.getFactories();
  }

  public getFactoriesManager() {
    return this.factoriesManager;
  }

  /* ******************************************************** 
                Configurations Functions
   ******************************************************** */

  public getConfigurations() {
    return this.workspacesManager.getWorkspaces();
  }

  public getWorkspacesWithNDevices = (quantity: number): any[] =>
    this.workspacesManager.getWorkspacesWithNDevices(quantity);

  public getCurrentConfiguration() {
    return this.workspacesManager.getCurrentWorkspace();
  }

  /*public getEmptyWorkspace() {
    return this.configurationsManager.getEmptyWorkspace();
  }*/

  /*public getPrimaryConfiguration() {
    return this.configurationsManager.getPrimaryConfiguration();
  }*/

  public getPrimaryWorkspace(nDevices: number) {
    return this.workspacesManager.getPrimaryWorkspace(nDevices);
  }

  public savePrimaryWorkspace(nDevices: number) {
    this.workspacesManager.saveLastWorkspace(nDevices);
  }

  /*public getPrimaryConfigurationShared() {
    return this.configurationsManager.getPrimaryConfigurationShared();
  }*/

  public renameConfiguration(id: string, oldValue: string, newValue: string) {
    this.workspacesManager.renameWorkspace(id, oldValue, newValue);
  }

  public getCurrentConfigurationOfRole(roleId: string) {
    return this.workspacesManager.getCurrentLayoutOfRole(roleId);
  }

  public saveConfiguration(name: string) {
    this.workspacesManager.saveWorkspace(name);
  }

  public resetWorkspace() {
    this.workspacesManager.resetWorkspace();
  }

  public loadConfiguration(workspace: IWorkspace) {
    this.workspacesManager.loadWorkspace(workspace);
  }

  public deleteConfigurationWithId(configId: string) {
    this.workspacesManager.deleteWorkspace(configId);
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

export const RoleModelsInstantiationFactory = new DataObjectFactory<
  RoleModelsDataObject,
  undefined,
  undefined,
  IEvent
>(
  RoleModelsDataObject.name,
  RoleModelsDataObject,
  [
    SharedMap.getFactory(),
    SharedCell.getFactory(),
    Ink.getFactory(),
    SharedCounter.getFactory(),
  ],
  []
);

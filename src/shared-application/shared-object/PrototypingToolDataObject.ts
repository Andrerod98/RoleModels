import { IFluidHandle } from "@fluidframework/core-interfaces";
import { SharedMap } from "@fluidframework/map";
import { SharedCell } from "@fluidframework/cell";
import { SharedCounter } from "@fluidframework/counter";
import { IEvent } from "@fluidframework/common-definitions";
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IInk, Ink } from "@fluidframework/ink";
import { IPrototypingToolDataModel } from "..";
import { CombinedView, ICombinedView } from "../combined-views/combined-view";
import {
  MultiCombinedView,
  IMultiViewCombinedView,
} from "../combined-views/multi-combined-view";
import {
  SingleCombinedView,
  ISingleViewCombinedView,
} from "../combined-views/single-combined-view";
import {
  PositionMap,
  IStitchingCombinedView,
} from "../combined-views/stitching-combined-view/IStitchingCombinedView";
import { StitchingCombinedView } from "../combined-views/stitching-combined-view/StitchingCombinedView";
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
} from "../components";
import { ThrowableFactory } from "../components/Throwable";
import { IDevice } from "../devices/IDevice";
import { CombinedViewsManager } from "../managers/CombinedViewsManager";
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
import { QRsManager } from "../managers/QRsManager";
import { RolesManager } from "../managers/RolesManager";
import { IQRCode } from "../qrcode/IQRCode";
import { QRCodeController } from "../qrcode/QRCodeController";
import { IRole } from "../roles/IRole";
import { Role } from "../roles/Role";
import { IView } from "../views/IView";
import { View } from "../views/View";
import { ButtonFactory } from "../components/Button";
import { uuid } from "uuidv4";
import { ViewsManager } from "../managers/ViewsManager";
import { ILayoutNode } from "../roles/ILayout";
import { LayoutNode } from "../roles/Layout";
import { Logger } from "../Logger";

export class PrototypingToolDataObject
  extends DataObject
  implements IPrototypingToolDataModel
{
  /* The Map with the connected devices */
  private devicesMap: SharedMap; // <device Id, IDevice>
  private devicesManager: DevicesManager;

  /* The Map with the combined Views */
  private combinedViewsMap: SharedMap; // <combined view Id, ICombinedView>
  private combinedViewsManager: CombinedViewsManager;

  /* The Map with the roles */
  private rolesMap: SharedMap; // <role name, IView>
  private rolesManager: RolesManager;

  /* The Map with the views */
  private viewsMap: SharedMap; // <view id, IView>
  private viewsManager: ViewsManager;

  /* The Map with the qr codes */
  private qrMap: SharedMap;
  private qrManager: QRsManager;

  /* The Map with the configurations */
  private configurationsMap: SharedMap;
  private currentConfiguration: SharedCell;
  private primaryConfiguration: SharedCell;
  private configurationsManager: ConfigurationsManager;

  /* The Map with the interactions */
  private interactionsMap: SharedMap;
  private interactionsManager: InteractionsManager;

  /* The Manager responsible for rendering components */
  private factoriesManager: FactoriesManager;

  /* Ink */
  private ink: IInk;

  private pingCounter: SharedCounter;
  private audio = new Audio("/public/ping.mp3");

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
    const qrMap = SharedMap.create(this.runtime);
    const interactionsMap = SharedMap.create(this.runtime);

    const ink = Ink.create(this.runtime);

    const sharedPing = SharedCounter.create(this.runtime);

    const configurationsMap = SharedMap.create(this.runtime);
    const currentConfiguration = SharedCell.create(this.runtime);
    currentConfiguration.set({
      name: "default",
      layouts: { default: { id: uuid(), name: "div" } },
    } as IConfiguration);

    const primaryConfiguration = SharedCell.create(this.runtime);
    primaryConfiguration.set({
      id: uuid(),
      name: "div",
    } as ILayoutNode);

    /* Creating default roles */
    const managerRole = SharedCell.create(this.runtime);

    managerRole.set({
      name: "manager",
      viewsIds: [],
      combinedViewsIds: [],
      qrIds: [],
    } as IRole);

    const designerRole = SharedCell.create(this.runtime);

    designerRole.set({
      name: "designer",
      viewsIds: [],
      combinedViewsIds: [],
      qrIds: [],
    } as IRole);

    const defaultRole = SharedCell.create(this.runtime);

    defaultRole.set({
      name: "default",
      viewsIds: [],
      combinedViewsIds: [],
      qrIds: [],
    } as IRole);

    rolesMap.set("manager", managerRole.handle);
    rolesMap.set("designer", designerRole.handle);
    rolesMap.set("default", defaultRole.handle);

    /* Setting shared objects in the root Map...*/
    this.root.set("devices", devicesMap.handle);
    this.root.set("roles", rolesMap.handle);
    this.root.set("views", viewsMap.handle);
    this.root.set("combined-views", combinedViewsMap.handle);
    this.root.set("qrs", qrMap.handle);
    this.root.set("ink", ink.handle);
    this.root.set("ping", sharedPing.handle);
    this.root.set("configurations", configurationsMap.handle);
    this.root.set("current-configuration", currentConfiguration.handle);
    this.root.set("primary-configuration", primaryConfiguration.handle);
    this.root.set("interactions", interactionsMap.handle);

    Logger.getInstance().info("The application has been setup with success.");
  }

  protected async hasInitialized() {
    /* Loading shared objects...*/
    Logger.getInstance().info("Loading shared objects...");
    await this.loadSharedObjects();

    /* Loading managers...*/
    Logger.getInstance().info("Loading managers...");
    this.loadManagers();

    /* Registering factories...*/
    Logger.getInstance().info("Registering default factories...");
    this.registerDefaultFactories();

    /* Creating event listeners...*/
    Logger.getInstance().info("Creating event listeners...");
    this.createAllEventListeners();

    /* Loading combined views...*/
    Logger.getInstance().info("Loading shared objects into the objects...");
    await Promise.all([
      this.rolesManager.loadRoles(1),
      this.combinedViewsManager.loadCombinedViews(1),
      this.configurationsManager.loadObject(),
      this.configurationsManager.loadPrimaryObject(),
      this.viewsManager.loadViews(1),
      this.qrManager.loadQRCodes(),
    ]);
    Logger.getInstance().info("The application has been loaded with success.");
  }

  private async loadSharedObjects() {
    const sharedMaps = await Promise.all([
      this.root.get<IFluidHandle<SharedMap>>("devices").get(),
      this.root.get<IFluidHandle<SharedMap>>("combined-views").get(),
      this.root.get<IFluidHandle<SharedMap>>("roles").get(),
      this.root.get<IFluidHandle<SharedMap>>("qrs").get(),
      this.root.get<IFluidHandle<SharedMap>>("configurations").get(),
      this.root.get<IFluidHandle<SharedMap>>("interactions").get(),
      this.root.get<IFluidHandle<SharedMap>>("views").get(),
    ]);

    const sharedObjects = await Promise.all([
      this.root.get<IFluidHandle<SharedCounter>>("ping").get(),
      this.root.get<IFluidHandle<SharedCell>>("current-configuration").get(),
      this.root.get<IFluidHandle<SharedCell>>("primary-configuration").get(),
      this.root.wait<IFluidHandle<IInk>>("ink"),
    ]);

    this.devicesMap = sharedMaps[0];
    this.combinedViewsMap = sharedMaps[1];
    this.rolesMap = sharedMaps[2];
    this.qrMap = sharedMaps[3];
    this.configurationsMap = sharedMaps[4];
    this.interactionsMap = sharedMaps[5];
    this.viewsMap = sharedMaps[6];

    this.pingCounter = sharedObjects[0];
    this.currentConfiguration = sharedObjects[1];
    this.primaryConfiguration = sharedObjects[2];
    this.ink = await sharedObjects[3].get();
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

    /* Creating combined views Manager...*/
    this.combinedViewsManager = new CombinedViewsManager(
      this.combinedViewsMap,
      this.factoriesManager
    );

    /* Creating qr Manager...*/
    this.qrManager = new QRsManager(this.qrMap);

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
  }

  public async createAllEventListeners() {
    this.runtime.on("connected", () => {
      this.emit("connected");
    });

    this.devicesMap.on("valueChanged", () => {
      this.emit("change", "Devices map changed");
    });
    this.combinedViewsMap.on("valueChanged", () => {
      this.emit("change", "Combined views map changed");
    });
    this.rolesMap.on("valueChanged", () => {
      this.emit("change", "Roles map changed");
    });

    this.qrMap.on("valueChanged", () => {
      this.emit("change", "QR map changed");
    });

    this.combinedViewsManager.on("changeState", () => {
      this.emit("change", "Combined view manager state changed.");
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

    //Remove this event listeners

    /* Creating shared cell event listeners*/
    await Promise.all([
      //this.createMapEventListeners("Combined View", this.combinedViewsMap),

      /* Creating views event listeners*/
      //this.createMapEventListeners("roles", this.rolesMap),

      this.createMapEventListeners("qrs", this.qrMap),
    ]);

    this.pingCounter.on("incremented", this.playSound);
  }

  public deleteAllEventListeners() {
    this.devicesMap.removeAllListeners();
    this.combinedViewsMap.removeAllListeners();
    this.rolesMap.removeAllListeners();
    this.qrMap.removeAllListeners();

    this.deleteMapEventListeners("Combined View", this.combinedViewsMap);
    this.deleteMapEventListeners("roles", this.rolesMap);
    this.deleteMapEventListeners("views", this.viewsMap);
    this.deleteMapEventListeners("qrs", this.qrMap);
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
  private async createMapEventListeners(name: string, map: SharedMap) {
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
  }

  public pingAll() {
    this.pingCounter.increment(1);
  }

  public playSound() {
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

  /********************************************************* 
                QR Codes Management Functions
   *********************************************************/

  public getMyQRCodes = (): QRCodeController[] => {
    return this.qrManager.getQRsWithIds(this.getMyRole().getQRIds());
  };

  public getQRCodesWithIds = (qrIDs: string[]): QRCodeController[] => {
    return this.qrManager.getQRsWithIds(qrIDs);
  };

  public getQRCode = (id: string): QRCodeController => {
    return this.qrManager.getQR(id);
  };

  public addQRCode(id: string, qrCode: IQRCode): QRCodeController {
    if (this.qrMap.has(id)) {
      return this.qrManager.getQR(id);
    }
    const sharedCell = SharedCell.create(this.runtime);

    sharedCell.set(qrCode);
    this.qrMap.set(id, sharedCell.handle);
    Logger.getInstance().info(`The QRCode with id ${id} has been added.`);
    return this.qrManager.addQR(sharedCell);
  }

  /* ******************************************************** 
                View Management Functions
   ******************************************************** */
  public getMyViews = (): View[] => {
    const viewsIds = this.getMyRole().getViews();
    return this.viewsManager.getViewsByIds(viewsIds);
  };

  public getAllViews = (): IterableIterator<View> => {
    return this.viewsManager.getViews();
  };

  public getViewsFrom = (role: string): View[] => {
    const viewsIds = this.getRole(role).getViews();
    return this.viewsManager.getViewsByIds(viewsIds);
  };

  public getViewOwners = (viewId: string): Role[] => {
    const roles = this.rolesManager.getRoles();
    const owners = [];
    for (const role of roles) {
      if (role.hasViewWithId(viewId)) {
        owners.push(role);
      }
    }

    return owners;
  };

  public getView = (viewId: string): View => {
    return this.viewsManager.getView(viewId);
  };

  public getLayoutWithView(viewId: string): LayoutNode {
    return this.configurationsManager.getLayoutWithView(viewId);
  }

  public migrateView = (view: View, from: string): void => {
    this.configurationsManager.removeViewFromRole(from, view.getId());
    this.rolesManager.getRole(from).removeView(view.getId());

    this.rolesManager.getRole(this.getMyRole().getName()).addView(view);
    Logger.getInstance().info(
      `The view with id ${view.getId()} from ${from} has been migrated.`
    );
  };

  /* Roles */
  /**
   * Get the role for the current device.
   */
  public getMyRole = (): Role => this.getRole(this.getDeviceRole());

  public getRole = (role: string): Role => this.rolesManager.getRole(role);

  public getDeviceRole = (): string => this.devicesManager.getMyDevice().role;

  public removeRole(roleName: string) {
    this.rolesManager.removeRole(roleName);
    Logger.getInstance().info(`The role ${roleName} has been removed.`);
  }

  public renameRole(oldName: string, newName: string) {
    this.rolesManager.renameRole(oldName, newName);
    Logger.getInstance().info(
      `The role ${oldName} has been renamed to ${newName}.`
    );
  }

  public addRole = async (role: string): Promise<Role> => {
    if (this.rolesMap.has(role)) {
      return this.rolesManager.getRole(role);
    }

    const sharedRole = SharedCell.create(this.runtime);
    sharedRole.on("valueChanged", () => {
      this.emit("change");
    });
    sharedRole.set({
      name: role,
      viewsIds: [],
      combinedViewsIds: [],
      qrIds: [],
    } as IRole);

    this.rolesManager.addRole(sharedRole);
    this.configurationsManager.updateCurrent(role, {
      id: uuid(),
      name: "div",
      viewId: "",
    });

    await this.rolesMap.wait<IFluidHandle<SharedCell>>(role);
    Logger.getInstance().info(`The role ${role} has been added.`);
    return this.rolesManager.getRole(role);
  };
  /**
   * Get the available roles.
   */
  public getRoles = (): IterableIterator<Role> => this.rolesManager.getRoles();

  /* ******************************************************** 
                Combined Views Management Functions
   ******************************************************** */
  /**
   * Returns the combined views of the device
   */
  public getCombinedViews = (): IterableIterator<CombinedView> =>
    this.combinedViewsManager.getCombinedViews();

  /**
   * Returns the combined views of the device
   */
  public getMyCombinedViews = (): CombinedView[] => {
    return this.combinedViewsManager.getCombinedViewsByIds(
      this.getMyRole().getCombinedViewsIds()
    );
  };

  public fromViewToCombinedView(view: View, role: string): View {
    if (view.isCombined()) {
      const cv = this.getCombinedViewWithId(view.getCombinedViewID());

      if (cv === undefined) return undefined;

      return this.getViewOfCombinedView(cv, role);
    }
  }

  public getCombinedViewOfView(view: View): CombinedView {
    if (view.getCombinedViewID() === "") {
      console.error("The view is not combined.");
      return undefined;
    }

    let combinedView = this.getCombinedViewWithId(view.getCombinedViewID());
    if (!combinedView) {
      console.error(
        "The view is associated but the combined view does not exist. Id:" +
          view.getCombinedViewID()
      );
      return undefined;
    }

    return combinedView;
  }

  public getViewOfCombinedView(combinedView: CombinedView, role: string): View {
    if (combinedView.isSingleView()) {
      return (combinedView as SingleCombinedView).getUI();
    } else {
      return (combinedView as MultiCombinedView).getUIFrom(role);
    }
  }

  public getCombinedViewWithId = (id: string): CombinedView => {
    return this.combinedViewsManager.getCombinedView(id);
  };

  public getCombinedViewsWithIds = (
    combinedViewsIDs: string[]
  ): CombinedView[] => {
    return this.combinedViewsManager.getCombinedViewsByIds(combinedViewsIDs);
  };

  private createCombinedView(
    id: string,
    combinedView: ICombinedView
  ): CombinedView {
    // Checks if combined view already exists
    if (this.combinedViewsMap.has(id)) {
      return this.combinedViewsManager.getCombinedView(id);
    }

    // Creates a shared cell and adds it to the shared map
    const sharedCell = SharedCell.create(this.runtime);
    sharedCell.on("valueChanged", () => {
      this.emit("change");
    });
    sharedCell.set(combinedView);
    this.combinedViewsMap.set(id, sharedCell.handle);

    // Adds the combined view to the manager
    const cvm = this.combinedViewsManager.addCombinedView(sharedCell);

    return cvm;
  }
  public mirrorViews(view1: View, view2: View): SingleCombinedView {
    // const view1New = View.from(view1.toView(), FactoriesManager.getInstance());
    // const view2New = View.from(view2.toView(), FactoriesManager.getInstance());
    // view1New.setCombinedViewID(id);
    // view2New.setCombinedViewID(id);
    const id = view1.getId() + "-" + view2.getId();
    // Adds the combined view id to the view
    view1.setCombinedViewID(id);
    view2.setCombinedViewID(id);

    // Creates a combined view
    const combinedView = this.createCombinedView(id, {
      id: id,
      type: "single",
      color: "primary",
      view: view1.toView(),
    } as ISingleViewCombinedView) as SingleCombinedView;

    // Add views and combined views to the roles
    const roles = this.getRoles();
    for (const role of roles) {
      if (role.hasViewWithId(view1.getId())) {
        //role.updateView(view1);
        role.addCombinedView(combinedView.getId());
      } else if (role.hasViewWithId(view2.getId())) {
        //role.updateView(view2);
        role.addCombinedView(combinedView.getId());
      }
    }

    return combinedView;
  }

  public getSingleCombinedView(id: string): SingleCombinedView {
    return this.combinedViewsManager.getCombinedView(id) as SingleCombinedView;
  }

  public getMultiCombinedView(id: string): MultiCombinedView {
    return this.combinedViewsManager.getCombinedView(id) as MultiCombinedView;
  }

  public getViewOrCombinedView(role: string, id: string): View {
    const view = this.viewsManager.getView(id);
    if (view === undefined) return undefined;

    if (view.isCombined()) {
      return this.getViewOfCombinedView(
        this.getCombinedViewWithId(view.getCombinedViewID()),
        role
      );
    }

    return view;
  }

  public getViewOrCombinedViewFromAllRoles(id: string): View {
    const roles = this.rolesManager.getRoles();
    let view = undefined;
    for (const role of roles) {
      view = this.getViewOrCombinedView(role.getName(), id);
      if (view) return view;
    }

    return view;
  }

  public updateViewOrCombinedView(role: string, view: View): void {
    if (view.isCombined()) {
      const cv = this.getCombinedViewWithId(view.getCombinedViewID());
      if (cv.isSingleView()) {
        (cv as SingleCombinedView).updateView(view.toView());
      } else {
        (cv as MultiCombinedView).updateView(view.toView(), role);
      }
    } else {
      this.viewsManager.getView(view.getId()).update(view.toView());
    }
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

  public stitchViews = (
    columns: number,
    rows: number,
    positions: PositionMap,
    view1: View,
    view2: View
  ): StitchingCombinedView => {
    const id = view1.getId() + "-" + view2.getId();
    view1.setCombinedViewID(id);
    view2.setCombinedViewID(id);

    const roles = this.getRoles();
    for (const role of roles) {
      if (role.hasView(view1) || role.hasView(view2)) {
        if (positions[role.getName()] === undefined) {
          positions[role.getName()] = 1;
        }
      }
    }

    // Creates a combined view
    const combinedView = this.createCombinedView(id, {
      id: id,
      type: "stitching",
      color: "primary",
      view: view1.toView(),
      columns: columns,
      rows: rows,
      positions: positions,
    } as IStitchingCombinedView) as StitchingCombinedView;

    // Add views and combined views to the roles
    for (const role of roles) {
      if (role.hasViewWithId(view1.getId())) {
        //role.updateView(view1);
        role.addCombinedView(combinedView.getId());
      } else if (role.hasViewWithId(view2.getId())) {
        //role.updateView(view2);
        role.addCombinedView(combinedView.getId());
      }
    }

    return combinedView;
  };

  public alternateViews = (view1: View, view2: View): MultiCombinedView => {
    const id = view1.getId() + "-" + view2.getId();
    return this.createCombinedView(id, {
      id: id,
      type: "multi",
      color: "primary",
      roleMap: {
        capturer: view1.toView(),
        viewer: view2.toView(),
      },
    } as IMultiViewCombinedView) as MultiCombinedView;
  };

  public uncombineViews = (combinedView: CombinedView): void => {
    /*for (const role of this.getRoles()) {
      if (role.hasViewWithCombinedView(combinedView.getId())) {
        const view = role.getViewWithCombinedView(combinedView.getId());

        view.setCombinedViewID("");

        role.updateView(view);
      }
    }*/
    this.combinedViewsMap.delete(combinedView.getId());
    this.combinedViewsManager.removeCombinedView(combinedView.getId());
  };

  public combineViews = (view1: View, view2: View): MultiCombinedView => {
    const id = view1.getId() + "-" + view2.getId();
    const roles = [];
    const view1New = View.from(
      view1.getSharedObject(),
      this.factoriesManager,
      this.interactionsManager
    );
    const view2New = View.from(
      view2.getSharedObject(),
      this.factoriesManager,
      this.interactionsManager
    );
    view1New.setCombinedViewID(id);
    view2New.setCombinedViewID(id);

    const rm = {} as { [role: string]: IView };

    for (const role of this.getRoles()) {
      if (role.hasViewWithId(view1New.getId())) {
        rm[role.getName()] = view1New.toView();

        roles.push(role);
      } else if (role.hasViewWithId(view2New.getId())) {
        rm[role.getName()] = view2New.toView();

        roles.push(role);
      }
    }

    const ICombinedView: IMultiViewCombinedView = {
      id: id,
      type: "multi",
      color: "primary",
      roleMap: rm,
    };

    const combinedView = this.createCombinedView(
      id,
      ICombinedView
    ) as MultiCombinedView;

    roles.forEach((role) => {
      role.addCombinedView(combinedView.getId());
      role.updateView(view1New);
      role.updateView(view2New);
    });

    return combinedView;
  };

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

  public renameConfiguration(oldValue: string, newValue: string) {
    this.configurationsManager.renameConfiguration(oldValue, newValue);
  }

  public getCurrentConfigurationOfRole(role: string) {
    return this.configurationsManager.getCurrentConfigurationOfRole(role);
  }

  public saveConfiguration() {
    this.configurationsManager.saveConfiguration();
  }

  public loadConfiguration(configName: string) {
    this.configurationsManager.loadConfiguration(configName);
  }

  public deleteConfiguration() {
    this.configurationsManager.getConfigurations();
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

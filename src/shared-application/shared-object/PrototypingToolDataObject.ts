/* eslint-disable no-undef */
/* eslint-disable no-redeclare */
/* eslint-disable guard-for-in */
/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */

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
import { InteractionsManager } from "../managers/InteractionsManager";
import { QRsManager } from "../managers/QRsManager";
import { RolesManager } from "../managers/RolesManager";
import { IQRCode } from "../qrcode/IQRCode";
import { QRCodeController } from "../qrcode/QRCodeController";
import { IRole } from "../roles/IRole";
import { Role } from "../roles/Role";
import { IView } from "../views/IView";
import { View } from "../views/View";
// import { SharedCounter } from "@fluidframework/counter";

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

  /* The Map with the qr codes */
  private qrMap: SharedMap;
  private qrManager: QRsManager;

  /* The Map with the configurations */
  private configurationsMap: SharedMap;
  private currentConfiguration: SharedCell;
  private configurationsManager: ConfigurationsManager;

  private interactions: SharedCell;
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

    const qrMap = SharedMap.create(this.runtime);

    const ink = Ink.create(this.runtime);

    const sharedPing = SharedCounter.create(this.runtime);

    const configurationsMap = SharedMap.create(this.runtime);
    const currentConfiguration = SharedCell.create(this.runtime);
    currentConfiguration.set({
      name: "default",
      layouts: { default: { name: "div" } },
    } as IConfiguration);
    /* Creating default roles */
    const managerRole = SharedCell.create(this.runtime);

    managerRole.set({
      name: "manager",
      views: [],
      combinedViewsIds: [],
      qrIds: [],
    } as IRole);

    const designerRole = SharedCell.create(this.runtime);

    designerRole.set({
      name: "designer",
      views: [],
      combinedViewsIds: [],
      qrIds: [],
    } as IRole);

    const defaultRole = SharedCell.create(this.runtime);

    defaultRole.set({
      name: "default",
      views: [],
      combinedViewsIds: [],
      qrIds: [],
    } as IRole);

    rolesMap.set("manager", managerRole.handle);
    rolesMap.set("designer", designerRole.handle);
    rolesMap.set("default", defaultRole.handle);

    const interactions = SharedCell.create(this.runtime);

    /* Setting shared objects in the root Map...*/
    this.root.set("devices", devicesMap.handle);
    this.root.set("roles", rolesMap.handle);
    this.root.set("combined-views", combinedViewsMap.handle);
    this.root.set("qrs", qrMap.handle);
    this.root.set("ink", ink.handle);
    this.root.set("ping", sharedPing.handle);
    this.root.set("configurations", configurationsMap.handle);
    this.root.set("current-configuration", currentConfiguration.handle);
    this.root.set("interactions", interactions.handle);
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
      this.combinedViewsManager.loadCombinedViews(1),
      this.configurationsManager.loadObject(),
      this.qrManager.loadQRCodes(),
    ]);

    this.runInteractions();
  }

  private async loadSharedObjects() {
    const sharedObjects = await Promise.all([
      this.root.get<IFluidHandle<SharedMap>>("devices").get(),
      this.root.get<IFluidHandle<SharedMap>>("combined-views").get(),
      this.root.get<IFluidHandle<SharedMap>>("roles").get(),
      this.root.get<IFluidHandle<SharedMap>>("qrs").get(),
      this.root.wait<IFluidHandle<IInk>>("ink"),
      this.root.get<IFluidHandle<SharedCounter>>("ping").get(),
      this.root.get<IFluidHandle<SharedMap>>("configurations").get(),
      this.root.get<IFluidHandle<SharedCell>>("current-configuration").get(),
      this.root.get<IFluidHandle<SharedCell>>("interactions").get(),
    ]);

    this.devicesMap = sharedObjects[0];
    this.combinedViewsMap = sharedObjects[1];
    this.rolesMap = sharedObjects[2];
    this.qrMap = sharedObjects[3];
    this.pingCounter = sharedObjects[5];
    this.configurationsMap = sharedObjects[6];
    this.currentConfiguration = sharedObjects[7];
    this.interactions = sharedObjects[8];
    this.ink = await sharedObjects[4].get();
  }

  private loadManagers() {
    /* Creating devices manager...*/
    this.devicesManager = new DevicesManager(this.devicesMap, this.runtime);

    /* Creating factories manager...*/
    this.factoriesManager = new FactoriesManager();

    /* Creating Roles manager...*/
    this.rolesManager = new RolesManager(this.rolesMap, this.factoriesManager);

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
      this.currentConfiguration
    );

    this.interactionsManager = new InteractionsManager(this, this.interactions);
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

  public clearAll(): void {
    this.devicesMap.clear();
    this.combinedViewsMap.clear();
    this.rolesMap.clear();
    this.qrMap.clear();
    this.ink.clear();
  }

  public deleteAllEventListeners() {
    this.devicesMap.removeAllListeners();
    this.combinedViewsMap.removeAllListeners();
    this.rolesMap.removeAllListeners();
    this.qrMap.removeAllListeners();

    this.deleteMapEventListeners("Combined View", this.combinedViewsMap);
    this.deleteMapEventListeners("roles", this.rolesMap);
    this.deleteMapEventListeners("qrs", this.qrMap);
    this.deleteMapEventListeners("configurations", this.configurationsMap);

    this.currentConfiguration.removeAllListeners();
    this.pingCounter.removeAllListeners();
    this.runtime.off("connected", () => {
      this.emit("connected");
    });

    this.interactions.removeAllListeners();

    this.rolesManager.deleteRolesEventListener();
    this.removeAllListeners();
  }

  private async deleteMapEventListeners(name: string, map: SharedMap) {
    const promises = [];
    for (const value of map.values()) {
      promises.push(value.get());
    }

    const results = await Promise.all([]);

    for (const result of results) {
      result.removeAllListeners();
    }
  }
  private async createMapEventListeners(name: string, map: SharedMap) {
    const promises = [];
    for (const value of map.values()) {
      promises.push(value.get());
    }

    const results = await Promise.all([]);

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

  public isDesigner = (): boolean => this.devicesManager.isDesigner();

  /**
   * Promotes the current device to the manager
   */
  public promoteToManager = (): void => {
    this.devicesManager.promoteToManager();
  };

  public promoteToDesigner = (): void => {
    this.devicesManager.promoteToDesigner();
  };

  /**
   * Promotes the current device to a specific role
   */
  public promoteToRole = (role: string, deviceId?: string): void => {
    this.devicesManager.promoteToRole(role, deviceId);
    // this.combinedViewsManager.changeRole(role);
  };

  /**
   * Updates the properties of a device
   */
  public changeDevice = (device: IDevice): void =>
    this.devicesManager.updateDevice(device);

  /* ******************************************************** 
                          Ink
   ******************************************************** */
  public getInk = (): IInk => this.ink;

  /* ******************************************************** 
                QR Codes Management Functions
   ******************************************************** */
  public getMyQrCodes = (): QRCodeController[] => {
    return this.qrManager.getQRsWithIds(this.getMyRole().getQRIds());
  };

  public getQrsWithIds = (qrIDs: string[]): QRCodeController[] => {
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
    return this.qrManager.addQR(sharedCell);
  }

  /* ******************************************************** 
                Role Management Functions
   ******************************************************** */
  public getMyViews = (): View[] => {
    return this.getMyRole()
      .getViews()
      .filter((view) => !view.isCombined());
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
    const roles = this.rolesManager.getRoles();
    for (const role of roles) {
      if (role.hasViewWithId(viewId)) {
        return role.getView(viewId);
      }
    }

    return undefined;
  };

  public grabView = (view: View): void => {
    console.log("Grabbed");
    this.getViewOwners(view.getId()).forEach((role) => {
      console.log("FOUND OWNER");
      this.configurationsManager.removeViewFromRole(
        role.getName(),
        view.getId()
      );
      this.rolesManager.getRole(role.getName()).removeView(view.getId());
    });
    this.rolesManager.getRole(this.getMyRole().getName()).addView(view);
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
  }

  public renameRole(oldName: string, newName: string) {
    this.rolesManager.renameRole(oldName, newName);
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
      views: [],
      combinedViewsIds: [],
      qrIds: [],
    } as IRole);

    this.rolesManager.addRole(sharedRole);
    this.configurationsManager.updateCurrent(role, { name: "div", viewId: "" });

    await this.rolesMap.wait<IFluidHandle<SharedCell>>(role);
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
        role.updateView(view1);
        role.addCombinedView(combinedView.getId());
      } else if (role.hasViewWithId(view2.getId())) {
        role.updateView(view2);
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
    const view = this.rolesManager.getRole(role).getView(id);
    if (view === undefined) return undefined;

    if (view.isCombined()) {
      return this.getViewOfCombinedView(
        this.getCombinedViewWithId(view.getCombinedViewID()),
        role
      );
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
      this.rolesManager.getRole(role).updateView(view);
    }
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
        role.updateView(view1);
        role.addCombinedView(combinedView.getId());
      } else if (role.hasViewWithId(view2.getId())) {
        role.updateView(view2);
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
    for (const role of this.getRoles()) {
      if (role.hasViewWithCombinedView(combinedView.getId())) {
        const view = role.getViewWithCombinedView(combinedView.getId());

        view.setCombinedViewID("");

        role.updateView(view);
      }
    }
    this.combinedViewsMap.delete(combinedView.getId());
    this.combinedViewsManager.removeCombinedView(combinedView.getId());
  };

  public combineViews = (view1: View, view2: View): MultiCombinedView => {
    const id = view1.getId() + "-" + view2.getId();
    const roles = [];
    const view1New = View.from(view1.toView(), this.factoriesManager);
    const view2New = View.from(view2.toView(), this.factoriesManager);
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

  public setInteractions(inter: string) {
    this.interactionsManager.setInteractions(inter);
  }

  public runInteractions() {
    this.interactionsManager.runInteractions();
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

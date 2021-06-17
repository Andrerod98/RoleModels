/* eslint-disable no-undef */
/* eslint-disable no-redeclare */
/* eslint-disable guard-for-in */
/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */

import { IFluidHandle } from "@fluidframework/core-interfaces";
import { SharedMap } from "@fluidframework/map";
import { SharedCell } from "@fluidframework/cell";
import { SharedCounter } from "@fluidframework/counter";
// import { SharedCounter } from "@fluidframework/counter";
import { CombinedViewsManager } from "./managers/CombinedViewsManager";
import { IDevice } from "./devices/IDevice";
import { IPrototypingToolDataModel } from "./IPrototypingToolDataModel";
import { CombinedView } from "./combined-views/combined-view/CombinedView";
import { View } from "./views/View";
import { IEvent } from "@fluidframework/common-definitions";
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { StitchingCombinedView } from "./combined-views/stitching-combined-view/StitchingCombinedView";
import {
  ISingleViewCombinedView,
  SingleCombinedView,
} from "./combined-views/single-combined-view";
import { DevicesManager } from "./managers/DevicesManager";
import { RolesManager } from "./managers/RolesManager";
import { ICombinedView } from "./combined-views/combined-view";
import {
  MultiCombinedView,
  IMultiViewCombinedView,
} from "./combined-views/multi-combined-view";
import { UIComponentFactory } from "./components/UIComponent/UIComponentFactory";
import { ImageFactory } from "./components/Image";
import { InputFactory } from "./components/Input";
import { ListFactory } from "./components/List";
import { RadioFactory } from "./components/Radio";
import { MapFactory } from "./components/Map";
import { LinkFactory } from "./components/Link";
import { FactoriesManager } from "./FactoriesManager";
import { IInk, Ink } from "@fluidframework/ink";
import { InkCanvasFactory } from "./components/InkCanvas";
import { Role } from "./roles/Role";
import { IRole } from "./roles/IRole";
import { QRManager } from "./qrcode/QRManager";
import { IQRCode } from "./qrcode/IQRCode";
import { QRCodeController } from "./qrcode/QRCodeController";
import {
  IStitchingCombinedView,
  PositionMap,
} from "./combined-views/stitching-combined-view/IStitchingCombinedView";
import { IView } from "./views/IView";
import { BoxFactory } from "./components/Box";
import { CenterFactory } from "./components/Center";
import { CheckboxFactory } from "./components/CheckBox";
import { EditableFactory } from "./components/Editable";
import { FlexFactory } from "./components/Flex";
import { GridFactory } from "./components/Grid";
import { SliderFactory } from "./components/Slider";
import { SpacerFactory } from "./components/Spacer";
import { StackFactory } from "./components/Stack";

export interface IPrototypingToolInitialState {
  combinedViews: string;
}

export class PrototypingToolDataObject
  extends DataObject<{}, IPrototypingToolInitialState>
  implements IPrototypingToolDataModel
{
  /* The Map with the connected devices */
  private devicesMap: SharedMap; // <device Id, IDevice>
  private devicesManager: DevicesManager;

  /* The Map with the combined Views */
  private combinedViewsMap: SharedMap; // <combined view Id, ICombinedView>
  private combinedViewsManager: CombinedViewsManager;

  /* The Map with the Views */
  private rolesMap: SharedMap; // <role name, IView>
  private rolesManager: RolesManager;

  private qrMap: SharedMap;
  private qrManager: QRManager;

  private factoriesManager: FactoriesManager;

  /* Ink */
  private ink: IInk;

  private pingCounter: SharedCounter;

  private audio = new Audio("/public/ping.mp3");

  public static get DataObjectName() {
    return "prototyping_tool";
  }

  protected async initializingFirstTime(
    initialState?: IPrototypingToolInitialState
  ) {
    console.log("INITIALIZING FIRST TIME");

    /* Creating device Shared Map...*/
    const devicesMap = SharedMap.create(this.runtime);

    /* Creating combined view Shared Map...*/
    const combinedViewsMap = SharedMap.create(this.runtime);

    /* Creating view Shared Map...*/
    const rolesMap = SharedMap.create(this.runtime);

    /* Creating qr Shared Map...*/
    const qrMap = SharedMap.create(this.runtime);

    const ink = Ink.create(this.runtime);

    const sharedPing = SharedCounter.create(this.runtime);

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

    /* Creating shared Cells...*/
    /* for (let i = 0; i < 5; i++) {
      const sharedCell = SharedCell.create(this.runtime);
      rolesMap.set("role-" + i, sharedCell.handle);
    }*/

    rolesMap.set("manager", managerRole.handle);
    rolesMap.set("designer", designerRole.handle);
    rolesMap.set("default", defaultRole.handle);

    /* Setting shared Cells in combined views Map...*/
    this.root.set("devices", devicesMap.handle);
    this.root.set("roles", rolesMap.handle);
    this.root.set("combined-views", combinedViewsMap.handle);
    this.root.set("qrs", qrMap.handle);
    this.root.set("ink", ink.handle);
    this.root.set("ping", sharedPing.handle);
  }

  /**
   * Helper function to set up event listeners for shared objects
   */
  /* private createEventListeners(sharedMap: SharedMap): void {
    // Set up an event listener for changes to values in the SharedMap
    sharedMap.on("valueChanged", () => {
      this.emit("change");
    });

    // Set up an event listener for clearing the data in a SharedMap
    sharedMap.on("clear", () => {
      this.emit("change");
    });

    /* const quorum = this.context.getQuorum();
    quorum.on("addMember", () => {
      this.emit("change");
    });

    quorum.on("removeMember", () => {
      this.emit("change");
    });
  }*/

  public getRolesMap() {
    return this.rolesMap;
  }

  private async loadSharedObjects() {
    /* Getting devices shared map...*/
    this.devicesMap = await this.root
      .get<IFluidHandle<SharedMap>>("devices")
      .get();

    /* Getting combined views shared map...*/
    this.combinedViewsMap = await this.root
      .get<IFluidHandle<SharedMap>>("combined-views")
      .get();

    /* Getting views shared map...*/
    this.rolesMap = await this.root.get<IFluidHandle<SharedMap>>("roles").get();

    /* Getting views shared map...*/
    this.qrMap = await this.root.get<IFluidHandle<SharedMap>>("qrs").get();

    /* Getting shared ink...*/
    const handle = await this.root.wait<IFluidHandle<IInk>>("ink");
    this.ink = await handle.get();

    this.pingCounter = await this.root
      .get<IFluidHandle<SharedCounter>>("ping")
      .get();
  }

  private loadManagers() {
    /* Creating devices manager...*/
    this.devicesManager = new DevicesManager(this.devicesMap, this.runtime);
    this.factoriesManager = new FactoriesManager();
    /* Creating factories manager...*/

    /* Creating Roles manager...*/
    this.rolesManager = new RolesManager(this.rolesMap, this.factoriesManager);

    /* Creating combined views Manager...*/
    this.combinedViewsManager = new CombinedViewsManager(
      this.combinedViewsMap,
      this.factoriesManager,
      () => {
        this.emit("change", "CVM");
      }
    );

    /* Creating combined views Manager...*/
    this.qrManager = new QRManager(this.qrMap);
  }

  public getRoot() {
    return this.root;
  }

  public clearAll(): void {
    //this.devicesMap.clear();
    this.combinedViewsMap.clear();
    this.rolesMap.clear();
    this.qrMap.clear();
    this.ink.clear();

    this.emit("cleared", "Clear all");
  }

  public getDevicesMap() {
    return this.devicesMap;
  }
  public getCombinedViewsMap() {
    return this.combinedViewsMap;
  }

  public getQRMap() {
    return this.qrMap;
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
      new InkCanvasFactory("ink", this.ink, this.factoriesManager)
    );
  }

  public changeState = () => {
    this.emit("change");
  };

  public playSound() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.play();
  }

  public deleteAllEventListeners() {
    console.warn("DELETING ALL EVENT LISTENERS");
    this.devicesMap.removeAllListeners();
    this.combinedViewsMap.removeAllListeners();
    this.rolesMap.removeAllListeners();
    this.qrMap.removeAllListeners();

    this.deleteMapEventListeners("Combined View", this.combinedViewsMap);
    this.deleteMapEventListeners("roles", this.rolesMap);
    this.deleteMapEventListeners("qrs", this.qrMap);
    this.pingCounter.removeAllListeners();
    this.removeAllListeners();
  }

  public createAllEventListeners() {
    this.devicesMap.on("valueChanged", () => {
      this.emit("change", "Devices map changed");
    });
    this.combinedViewsMap.on("valueChanged", () => {
      this.emit("change", "Combined views map changed");
    });
    this.rolesMap.on("valueChanged", () => {
      this.emit("change", "Roles map changed");
    });
    this.rolesMap.on("changeState", () => {
      this.emit("change", "Roles map adeed");
    });
    this.qrMap.on("valueChanged", () => {
      this.emit("change", "QR map changed");
    });

    /* Creating shared cell event listeners*/
    this.createMapEventListeners("Combined View", this.combinedViewsMap);

    /* Creating views event listeners*/
    this.createMapEventListeners("roles", this.rolesMap);

    this.createMapEventListeners("qrs", this.qrMap);

    this.pingCounter.on("incremented", this.playSound);

    /*
    const quorum = this.context.getQuorum();

    quorum.on("addMember", () => {
      this.audio.play();
      this.emit("change");
    });

    quorum.on("removeMember", () => {
      this.audio.play();
      this.emit("change");
    });*/
  }

  private async deleteMapEventListeners(name: string, map: SharedMap) {
    for (const value of map.values()) {
      const cell = await value.get();
      cell.removeAllListeners();
    }
  }
  private async createMapEventListeners(name: string, map: SharedMap) {
    for (const value of map.values()) {
      const cell = await value.get();
      cell.on("valueChanged", () => {
        this.emit("change", "Cell of " + name + " changed.");
      });
    }
  }

  public pingAll() {
    this.pingCounter.increment(1);
  }

  protected async hasInitialized() {
    console.log("HAS INITIALIZED");
    /* Has initialized...*/

    /* Loading shared objects...*/
    await this.loadSharedObjects();

    this.loadManagers();

    /* Registering factories...*/

    this.registerDefaultFactories();

    this.createAllEventListeners();

    /* Adding current device...*/
    //this.devicesManager.addDevice("manager");
    //this.devicesManager.addMyDevice();

    /* Loading combined views...*/
    await this.rolesManager.loadRoles();
    await this.combinedViewsManager.loadCombinedViews(this.factoriesManager);
    await this.qrManager.loadQRCodes();

    this.runtime.once("connected", () => {
      this.emit("connected");
    });
  }

  /* Device Management Functions*/

  public getDevicesManager = () => this.devicesManager;
  public getCombinedViewsManager = () => this.combinedViewsManager;
  public getRolesManager = () => this.rolesManager;

  /**
   * Creates a "fake" user based on a fake user id and a fake name.
   * Only use this code for protoyping and demos.
   */
  public addDevice = (role: string): void =>
    this.devicesManager.addDevice(role);

  /**
   * Deletes the current device from the session
   */
  public deleteDevice = (): void => this.devicesManager.deleteDevice();

  /**
   * Get the device object for the current device.
   */
  public getDevice = (): IDevice => this.devicesManager.getDevice();

  /**
   * Get an array of all devices objects for the devices
   * who have joined the session (even if they have left).
   */
  public getDevices = (): IDevice[] => this.devicesManager.getDevices();

  public getInk = (): IInk => this.ink;
  /**
   * Returns the combined views of the device
   */
  public getCombinedViews = (): CombinedView[] =>
    this.combinedViewsManager.getCombinedViews();

  /**
   * Returns the combined views of the device
   */
  public getMyCombinedViews = (): CombinedView[] => {
    return this.combinedViewsManager.getCombinedViewsWithIds(
      this.getRole().getCombinedViewsIds()
    );
  };

  public fromViewToCombinedView(view: View, role: string): View {
    if (view.isCombined()) {
      const cv = this.getCombinedViewWithId(view.getCombinedViewID());

      if (cv === undefined) return undefined;

      return this.fromCombinedViewToView(cv, role);
    }
  }

  public fromCombinedViewToView(
    combinedView: CombinedView,
    role: string
  ): View {
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
    return this.combinedViewsManager.getCombinedViewsWithIds(combinedViewsIDs);
  };

  public getMyQrCodes = (): QRCodeController[] => {
    return this.qrManager.getQRsWithIds(this.getRole().getQRIds());
  };

  public getQrsWithIds = (qrIDs: string[]): QRCodeController[] => {
    return this.qrManager.getQRsWithIds(qrIDs);
  };

  public getMyViews = (): View[] => {
    return this.getRole()
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

  public getQRCode = (id: string): QRCodeController => {
    return this.qrManager.getQR(id);
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
    this.getViewOwners(view.getId()).forEach((role) => {
      this.rolesManager.removeView(role.getName(), view.getId());
    });
    this.rolesManager.addView(this.getRole().getName(), view);
  };

  /* Roles */
  /**
   * Get the role for the current device.
   */
  public getRole = (): Role => this.rolesManager.getRole(this.getDeviceRole());

  public getDeviceRole = (): string => this.devicesManager.getDevice().role;

  public addRole = async (role: string): Promise<Role> => {
    if (this.rolesMap.has(role)) {
      console.log("ROLE ALREADY EXISTS");
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

    this.rolesMap.set(role, sharedRole.handle);

    await this.rolesMap.wait<IFluidHandle<SharedCell>>(role);
    return this.rolesManager.getRole(role);
  };
  /**
   * Get the available roles.
   */
  public getRoles = (): Role[] => this.rolesManager.getRoles();

  /* private async setView(role: string, view: View) {
    console.log("Creating a shared cell. (View)");
    const sharedCell = await this.combinedViewsMap
      .get("view-" + this.combinedViewsCounter)
      .get();
    sharedCell.set(view.toView());
  }*/

  public addQRCode(id: string, qrCode: IQRCode): QRCodeController {
    if (this.qrMap.has(id)) {
      return this.qrManager.getQR(id);
    }
    const sharedCell = SharedCell.create(this.runtime);

    sharedCell.set(qrCode);
    this.qrMap.set(id, sharedCell.handle);
    return this.qrManager.addQR(sharedCell);
  }

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
    console.log(view1);

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
    const view = this.getRolesManager().getRole(role).getView(id);
    if (view === undefined) return undefined;

    if (view.isCombined()) {
      return this.fromCombinedViewToView(
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
      console.log("Updating view");
      this.getRolesManager().getRole(role).updateView(view);
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
    console.log(view1);

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
    this.getRoles().forEach((role) => {
      if (role.hasViewWithCombinedView(combinedView.getId())) {
        const view = role.getViewWithCombinedView(combinedView.getId());

        view.setCombinedViewID("");

        role.updateView(view);
      }
    });
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

    this.getRoles().forEach((role) => {
      if (role.hasViewWithId(view1New.getId())) {
        rm[role.getName()] = view1New.toView();

        roles.push(role);
      } else if (role.hasViewWithId(view2New.getId())) {
        rm[role.getName()] = view2New.toView();

        roles.push(role);
      }
    });

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

  public registerFactory(factory: UIComponentFactory) {
    this.factoriesManager.registerFactory(factory);
  }

  /**
   * Get the manager device
   */
  public getManagerDevice = (): IDevice => this.devicesManager.getManager();

  /**
   * Get the manager device
   */
  public getFactoriesManager = (): FactoriesManager => this.factoriesManager;

  /**
   * Get a connected device with a role
   */
  public getDeviceByRole = (role: string): IDevice =>
    this.devicesManager.getDeviceByRole(role);

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
    this.devicesManager.changeDevice(device);

  /**
   * Get an array of all active roles.
   */
  public getDevicesWithRoles = (): IDevice[] => {
    return this.devicesManager.getDevicesWithRoles();
  };

  /**
   * Get an array of all possible combinations of connected devices and roles
   
  public getCombinations(): { [role: string]: string }[] {
    return this.rolesManager.getCombinations();
  }

  public switchToCombination(combination: { [role: string]: string }) {
    this.rolesManager.switchToCombination(combination);
  }
*/
  public getId(): string {
    return this.context.documentId;
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
  IPrototypingToolInitialState,
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
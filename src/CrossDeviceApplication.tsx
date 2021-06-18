import { ChakraProvider } from "@chakra-ui/react";
import { getContainer } from "@fluid-experimental/get-container";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import React from "react";
import ReactDOM from "react-dom";
import { CombinedView } from "./shared-object/combined-views/combined-view";
import { PositionMap } from "./shared-object/combined-views/stitching-combined-view/IStitchingCombinedView";
import { UIComponentFactory } from "./shared-object/components/UIComponent";
import { PrototypingToolContainerFactory } from "./shared-object/container";
import { PrototypingToolDataObject } from "./shared-object/PrototypingToolDataObject";
import { IQRCode } from "./shared-object/qrcode/IQRCode";
import { QRCodeController } from "./shared-object/qrcode/QRCodeController";
import { Role } from "./shared-object/roles/Role";
import { IView } from "./shared-object/views/IView";
import { View } from "./shared-object/views/View";
import { Container } from "@fluidframework/container-loader";
import { TinyliciousServiceWithUrl } from "./utils/tinyliciousService";
import { MainComponent } from "./components/MainComponent";
import Utils from "./utils/Utils";

export class CrossDeviceApplication {
  protected sharedObject: PrototypingToolDataObject;
  protected container: Container;

  private setInteractions: () => void = () => {};

  constructor(
    public readonly serverUrl: string,
    public readonly projectName,
    readonly isFirst
  ) {}

  public getServerUrl(): string {
    return this.serverUrl;
  }

  public isFirstClient(): boolean {
    return this.isFirst;
  }

  public defineInteractions(listener: () => void) {
    this.setInteractions = listener;
  }

  public getSharedObject(): PrototypingToolDataObject {
    return this.sharedObject;
  }

  public getContainer(): Container {
    return this.container;
  }

  public viewsToString = (views: IView[]) => {
    let fullStr = "";
    views.forEach((view) => {
      fullStr = fullStr + Utils.jsonToString(view);
    });
    return fullStr;
  };

  /*private isNewDocument(): boolean {
    return window.location.hash.length === 0;
  }*/

  public reRender() {
    this.sharedObject.emit("change");
  }

  public getProjectName(): string {
    return this.projectName;
  }

  public pingAll(): void {
    this.sharedObject.pingAll();
  }

  public async start() {
    const serviceTiny = new TinyliciousServiceWithUrl(this.serverUrl, 7070);

    this.container = await getContainer(
      serviceTiny,
      this.projectName,
      PrototypingToolContainerFactory,
      this.isFirst
    );

    // Get the Default Object from the Container
    this.sharedObject =
      await getDefaultObjectFromContainer<PrototypingToolDataObject>(
        this.container
      );

    // Setting "fluidStarted" is just for our test automation
    // eslint-disable-next-line dot-notation
    window["fluidStarted"] = true;
  }

  public render(div: HTMLElement) {
    ReactDOM.render(
      <ChakraProvider>
        <MainComponent app={this} />
      </ChakraProvider>,
      div
    );

    return div;
  }

  public getFullHost() {
    return "https://" + this.serverUrl + ":8080/#project=" + this.projectName;
  }

  public grabView(view: View): void {
    this.sharedObject.grabView(view);
  }

  public async addRole(role: string): Promise<Role> {
    return await this.sharedObject.addRole(role);
  }

  public addQRCode(id: string, qrcode: IQRCode, ...roles): QRCodeController {
    roles.forEach((r: Role) => {
      r.addQRCode(id);
    });
    return this.sharedObject.addQRCode(id, qrcode);
  }

  public getQRCode(id: string): QRCodeController {
    return this.sharedObject.getQRCode(id);
  }

  public registerFactory(factory: UIComponentFactory) {
    this.sharedObject.registerFactory(factory);
  }

  public getMyRole(): Role {
    return this.sharedObject.getMyRole();
  }

  public addDevice(device: string) {}

  public mirrorViews(view1: View, view2: View) {
    const cvm = this.sharedObject.mirrorViews(view1, view2);
    this.setInteractions();
    return cvm;
  }

  public stitchViews(
    columns: number,
    rows: number,
    positions: PositionMap,
    view1: View,
    view2: View
  ) {
    const cvm = this.sharedObject.stitchViews(
      columns,
      rows,
      positions,
      view1,
      view2
    );
    this.setInteractions();
    return cvm;
  }

  public getQRsWithId(qrIDs: string[]) {
    return this.sharedObject.getQrsWithIds(qrIDs);
  }

  public getCombinedViewWithId(id: string) {
    return this.sharedObject.getCombinedViewWithId(id);
  }

  public getCombinedViewsWithId(combinedViewsIDs: string[]) {
    return this.sharedObject.getCombinedViewsWithIds(combinedViewsIDs);
  }

  public getSingleCombinedView(id: string) {
    return this.sharedObject.getSingleCombinedView(id);
  }

  public getMultiCombinedView(id: string) {
    return this.sharedObject.getMultiCombinedView(id);
  }

  public getRole(role: string) {
    return this.sharedObject.getRole(role);
  }

  public getViewOrCombinedView(role: string, id: string): View {
    const view = this.getRole(role).getView(id);
    if (view === undefined) return undefined;

    if (view.isCombined()) {
      return this.fromCombinedViewToView(
        this.getCombinedViewWithId(view.getCombinedViewID()),
        role
      );
    }

    return view;
  }

  public getViewsOrCombinedViews(role: string): View[] {
    const views = this.getRole(role).getViews();

    views.forEach((view, index) => {
      if (view.isCombined()) {
        views[index] = this.fromCombinedViewToView(
          this.getCombinedViewWithId(view.getCombinedViewID()),
          role
        );
      }
    });

    return views;
  }

  public fromViewToCombinedView(view: View, role: string): View {
    return this.sharedObject.fromViewToCombinedView(view, role);
  }

  public fromCombinedViewToView(
    combinedView: CombinedView,
    role: string
  ): View {
    return this.sharedObject.fromCombinedViewToView(combinedView, role);
  }

  public alternateViews(
    id: string,
    view1: View,
    view2: View,
    options?: { alternateVariables: string[] }
  ) {
    return this.sharedObject.alternateViews(view1, view2);
  }

  public combineViews(view1: View, view2: View) {
    return this.sharedObject.combineViews(view1, view2);
  }
}

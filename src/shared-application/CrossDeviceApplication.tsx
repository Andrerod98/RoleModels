import { ChakraProvider } from "@chakra-ui/react";
import { getContainer } from "@fluid-experimental/get-container";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import React from "react";
import ReactDOM from "react-dom";
import { CombinedView } from "./combined-views/combined-view";
import { UIComponentFactory } from "./components/UIComponent";
import { PrototypingToolContainerFactory } from "./container";
import { IQRCode } from "./qrcode/IQRCode";
import { QRCodeController } from "./qrcode/QRCodeController";
import { Role } from "./roles/Role";
import { IView } from "./views/IView";
import { View } from "./views/View";
import { Container } from "@fluidframework/container-loader";
import { TinyliciousServiceWithUrl } from "../utils/tinyliciousService";
import { CrossDeviceApplicationView } from "./CrossDeviceApplicationView";
import Utils from "../utils/Utils";
import { PrototypingToolDataObject } from "./shared-object/PrototypingToolDataObject";

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

  public downloadCertificate() {
    const element = document.createElement("a");
    element.setAttribute("href", "../../../host.crt");
    element.setAttribute("download", "host.crt");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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
        <CrossDeviceApplicationView app={this} />
      </ChakraProvider>,
      div
    );

    return div;
  }

  public getFullHost() {
    return "https://" + this.serverUrl + ":8080/#project=" + this.projectName;
  }

  public grabView(view: View, from: string): void {
    this.sharedObject.grabView(view, from);
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

  public stitchViews(view1: View, view2: View) {
    const cvm = this.sharedObject.stitchViews(1, 1, {}, view1, view2);
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

  public getRole(role: string): Role {
    return this.sharedObject.getRole(role);
  }

  public getCombinedViewOfView() {}

  public getViewOrCombinedView(
    role: string,
    viewID: string
  ): [View, CombinedView] {
    const view = this.sharedObject.getView(viewID);
    if (view === undefined) {
      console.error("The view does not exist in role " + role);
      return [undefined, undefined];
    }

    if (view.isCombined()) {
      const combinedView = this.sharedObject.getCombinedViewOfView(view);
      if (combinedView === undefined) return [view, null];
      const viewC = this.sharedObject.getViewOfCombinedView(combinedView, role);
      return [viewC, combinedView];
    }

    return [view, null];
  }

  public getViewsOrCombinedViews(role: string): [View, CombinedView][] {
    const views = this.getRole(role).getViews();
    let result = [];

    views.forEach((viewId, index) => {
      result.push(this.getViewOrCombinedView(role, viewId));
    });

    return result;
  }

  public fromViewToCombinedView(view: View, role: string): View {
    return this.sharedObject.fromViewToCombinedView(view, role);
  }

  public fromCombinedViewToView(
    combinedView: CombinedView,
    role: string
  ): View {
    return this.sharedObject.getViewOfCombinedView(combinedView, role);
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

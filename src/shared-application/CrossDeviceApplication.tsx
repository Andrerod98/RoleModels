import { ChakraProvider } from "@chakra-ui/react";
import { getContainer } from "@fluid-experimental/get-container";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import React from "react";
import ReactDOM from "react-dom";
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
    this.sharedObject.migrateView(view, from);
  }

  public async addRole(role: string): Promise<Role> {
    return await this.sharedObject.addRole(role);
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

  public getQRsWithId(qrIDs: string[]) {
    return this.sharedObject.getQRCodesWithIds(qrIDs);
  }

  public getRole(role: string): Role {
    return this.sharedObject.getRole(role);
  }
}

import { getContainer } from "@fluid-experimental/get-container";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import React from "react";
import ReactDOM from "react-dom";
import { RoleModelsContainerFactory } from "./RoleModelsContainer";
import { Container } from "@fluidframework/container-loader";
import { TinyliciousServiceWithUrl } from "../utils/tinyliciousService";
import { CrossDeviceApplicationView } from "./CrossDeviceApplicationView";
import { RoleModelsDataObject } from "./shared-object/RoleModelsDataObject";

export class CrossDeviceApplication {
  protected sharedObject: RoleModelsDataObject;
  protected container: Container;

  constructor(
    public readonly serverUrl: string,
    public readonly projectName: string
  ) {}

  public registerDefaultFactories() {}
  public getServerURL(): string {
    return this.serverUrl;
  }

  public getProjectName(): string {
    return this.projectName;
  }

  public getHomepageURL() {
    return "https://" + this.serverUrl + ":8080";
  }

  public getFullURL() {
    return "https://" + this.serverUrl + ":8080/#project=" + this.projectName;
  }

  public getSharedObject(): RoleModelsDataObject {
    return this.sharedObject;
  }

  public getContainer(): Container {
    return this.container;
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

  public async start(isFirst: boolean) {
    const serviceTiny = new TinyliciousServiceWithUrl(this.serverUrl, 7070);

    this.container = await getContainer(
      serviceTiny,
      this.projectName,
      RoleModelsContainerFactory,
      isFirst
    );

    // Get the Default Object from the Container
    this.sharedObject =
      await getDefaultObjectFromContainer<RoleModelsDataObject>(this.container);

    this.registerDefaultFactories();

    window["fluidStarted"] = true;
  }

  public render(div: HTMLElement) {
    ReactDOM.render(<CrossDeviceApplicationView app={this} />, div);

    return div;
  }
}

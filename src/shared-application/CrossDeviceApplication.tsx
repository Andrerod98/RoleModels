import { getContainer } from "@fluid-experimental/get-container";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import React from "react";
import ReactDOM from "react-dom";
import { PrototypingToolContainerFactory } from "./container";
import { Container } from "@fluidframework/container-loader";
import { TinyliciousServiceWithUrl } from "../utils/tinyliciousService";
import { CrossDeviceApplicationView } from "./CrossDeviceApplicationView";
import { PrototypingToolDataObject } from "./shared-object/PrototypingToolDataObject";
import {
  RadioFactory,
  MapFactory,
  ListFactory,
  LinkFactory,
  InputFactory,
  ImageFactory,
  FlexFactory,
  SpacerFactory,
  BoxFactory,
  CenterFactory,
  StackFactory,
  GridFactory,
  CheckboxFactory,
  EditableFactory,
  SliderFactory,
  InkCanvasFactory,
} from "../shared-components";
import { ButtonFactory } from "../shared-components/Button";
import { QRCodeFactory } from "../shared-components/QRCode";
import { ThrowableFactory } from "../shared-components/Throwable";

export class CrossDeviceApplication {
  protected sharedObject: PrototypingToolDataObject;
  protected container: Container;

  constructor(
    public readonly serverUrl: string,
    public readonly projectName: string
  ) {}

  public registerDefaultFactories() {
    this.sharedObject.registerFactory(
      new RadioFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new MapFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new ListFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new LinkFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new InputFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new ImageFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new FlexFactory(this.sharedObject.getFactoriesManager())
    );

    this.sharedObject.registerFactory(
      new SpacerFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new BoxFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new CenterFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new StackFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new GridFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new CheckboxFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new EditableFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new SliderFactory(this.sharedObject.getFactoriesManager())
    );

    this.sharedObject.registerFactory(
      new ThrowableFactory(this.sharedObject.getFactoriesManager())
    );

    this.sharedObject.registerFactory(
      new ButtonFactory(this.sharedObject.getFactoriesManager())
    );
    this.sharedObject.registerFactory(
      new InkCanvasFactory(
        this.getSharedObject().getInk(),
        this.sharedObject.getFactoriesManager()
      )
    );

    this.sharedObject.registerFactory(
      new QRCodeFactory(this.sharedObject.getFactoriesManager())
    );
  }
  public getServerURL(): string {
    return this.serverUrl;
  }

  public getProjectName(): string {
    return this.projectName;
  }

  public getFullURL() {
    return "https://" + this.serverUrl + ":8080/#project=" + this.projectName;
  }

  public getSharedObject(): PrototypingToolDataObject {
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
      PrototypingToolContainerFactory,
      isFirst
    );

    // Get the Default Object from the Container
    this.sharedObject =
      await getDefaultObjectFromContainer<PrototypingToolDataObject>(
        this.container
      );

    this.registerDefaultFactories();

    window["fluidStarted"] = true;
  }

  public render(div: HTMLElement) {
    ReactDOM.render(<CrossDeviceApplicationView app={this} />, div);

    return div;
  }
}

import { SharedMap } from "@fluidframework/map";
import { IFluidDataStoreRuntime } from "@fluidframework/datastore-definitions";
import { IDevice } from "../devices/IDevice";
import DeviceDetector, { DeviceDetectorResult } from "device-detector-js";
import { Logger } from "../Logger";

/* This class is responsible for managing the connected devices */
enum DefaultRoles {
  Manager = "manager",
  Designer = "designer",
  Default = "default",
}
export class DevicesManager {
  private deviceId: string;

  public constructor(
    private readonly devicesMap: SharedMap,
    private readonly runtime: IFluidDataStoreRuntime
  ) {
    this.setEventListeners();
  }

  /* Defines the event listeners needed */
  private setEventListeners() {
    const quorum = this.runtime.getQuorum();

    this.runtime.on("connected", (clientId: string) => {
      this.hasConnected(clientId);
    });

    quorum.on("removeMember", (clientId: string) => {
      this.memberRemoved(clientId);
    });
  }

  /* Removes the event listeners */
  public removeEventListeners() {
    this.runtime.off("connected", (clientId: string) => {
      this.hasConnected(clientId);
    });
    const quorum = this.runtime.getQuorum();
    quorum.off("removeMember", (clientId: string) => {
      this.memberRemoved(clientId);
    });
  }

  /* Removes the devices that are disconnected from the shared map */
  private clearDisconnectedDevices() {
    const quorumKeys = this.runtime.getQuorum().getMembers();
    const devicesKeys = this.devicesMap.keys();

    for (const key of devicesKeys) {
      if (!quorumKeys.has(key)) {
        this.devicesMap.delete(key);
      }
    }
  }

  /* Getters */
  /*
   * Get an array of all connected devices.
   */
  public getDevices(): IterableIterator<IDevice> {
    return this.devicesMap.values();
  }

  /*
   * Get the device object for the current device.
   */
  public getMyDevice = (): IDevice => {
    return this.devicesMap.get<IDevice>(this.deviceId);
  };

  /*
   * Get the devices object with a specific role.
   */
  public getDevicesWithRole(role: string): IDevice[] {
    const devices = Array.from(this.getDevices());
    return devices.filter((device) => device.role === role);
  }

  /*
   * Get the device object with an id.
   */
  public getDevice(id: string): IDevice {
    const devices = Array.from(this.getDevices());
    return devices.find((device) => device.id === id);
  }

  /*
   * Retrieves the number of connected devices
   */
  public getConnectedDevices() {
    return this.runtime.getAudience().getMembers();
  }

  /*
   * Updates the properties of a device
   */
  public updateDevice(device: IDevice): void {
    if (this.devicesMap.has(device.id)) {
      this.devicesMap.set(device.id, device);
    } else {
      console.error(
        `The device with id ${device.id} was not found therefore was not changed.`
      );
    }
  }

  /*
   * Promotes a certain device to a role. In case the device ID is not specified
   * it updates the current device
   */
  public promoteToRole(role: string, deviceId?: string) {
    let device: IDevice;
    if (deviceId === undefined) {
      device = this.getMyDevice();
    } else {
      device = this.getDevice(deviceId);
    }

    device.role = role;
    this.updateDevice(device);
  }

  /* Remove from here */
  /*
   * Promotes the current device to manager
   */
  public promoteToManager(): void {
    this.promoteToRole(DefaultRoles.Manager);
  }

  /*
   * Promotes the current device to designer
   */
  public promoteToDesigner(): void {
    this.promoteToRole(DefaultRoles.Designer);
  }

  public isManager(): boolean {
    return this.getMyDevice().role === DefaultRoles.Manager;
  }

  public isDesigner(): boolean {
    return this.getMyDevice().role === DefaultRoles.Designer;
  }

  /*
   * Extracts the properties of the current device
   */
  private extractDeviceProperties(): DeviceDetectorResult {
    const deviceDetector = new DeviceDetector({ skipBotDetection: true });
    return deviceDetector.parse(navigator.userAgent);
  }

  /* Callback functions */

  /**
   * This function is called when a device connects
   */
  private hasConnected(clientId: string) {
    this.clearDisconnectedDevices();

    const details = this.runtime.getQuorum().getMember(clientId);
    if (!details) {
      Logger.getInstance().error(
        `The details of the device with id ${clientId} could not be retrieved.`
      );
      return;
    }
    const interactive = details.client.details.capabilities.interactive;

    this.deviceId = clientId;
    if (interactive) {
      const properties = this.extractDeviceProperties();

      const device = {
        id: clientId,
        type:
          properties.device.type === "" ? "smartphone" : properties.device.type,
        role: "manager",
      };

      this.devicesMap.set(device.id, device);
    }

    Logger.getInstance().success(`This device has been connected.`);
  }

  /**
   * This function is called when a device is removed
   */
  private memberRemoved(clientId: string) {
    if (this.devicesMap.has(clientId)) {
      Logger.getInstance().warning(
        `This device with id ${clientId} has been removed.`
      );
      this.devicesMap.delete(clientId);
    }
  }
}

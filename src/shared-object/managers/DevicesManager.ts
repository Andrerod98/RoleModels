/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */
import { SharedMap } from "@fluidframework/map";
import { IFluidDataStoreRuntime } from "@fluidframework/datastore-definitions";
import { IDevice } from "../devices/IDevice";

/* This class is responsible for managing the connected devices */
export class DevicesManager {
  private deviceId: string;

  public constructor(
    private readonly devicesMap: SharedMap,
    private readonly runtime: IFluidDataStoreRuntime // private template: ITemplate
  ) {
    this.load();
  }

  public load() {
    this.clearDisconnectedDevices();
    this.setEventListeners();
  }

  private clearDisconnectedDevices() {
    const keys = this.runtime.getQuorum().getMembers();

    const devicesKeys = this.devicesMap.keys();
    for (const key of devicesKeys) {
      if (!keys.has(key)) {
        this.devicesMap.delete(key);
      }
    }
  }

  private setEventListeners() {
    const quorum = this.runtime.getQuorum();

    this.runtime.on("connected", (clientId: string) => {
      this.hasConnected(clientId);
    });

    quorum.on("removeMember", (clientId: string) => {
      this.memberRemoved(clientId);
    });
  }

  public removeEventListeners() {
    this.runtime.off("connected", (clientId: string) => {
      this.hasConnected(clientId);
    });
    const quorum = this.runtime.getQuorum();
    quorum.off("removeMember", (clientId: string) => {
      this.memberRemoved(clientId);
    });
  }

  /**
   * Changes the properties of a device
   */
  public changeDevice(device: IDevice): void {
    if (this.devicesMap.has(device.id)) {
      this.devicesMap.set(device.id, device);
      // this.devicesMap.emit("deviceChange", device);
    } else {
      console.error(
        `The device with id ${device.id} was not found therefore was not changed.`
      );
    }
  }
  /**
   * Get an array of all devices objects for the devices
   * who have joined the session (even if they have left).
   */
  public getDevices(): IterableIterator<IDevice> {
    return this.devicesMap.values();
  }

  /**
   * Get the device object for the current device.
   */
  public getDevice = (): IDevice => {
    return this.devicesMap.get<IDevice>(this.deviceId);
  };

  /**
   * Get the device object with a role.
   */
  public getDevicesByRole(role: string): IDevice[] {
    const devices = Array.from(this.getDevices());
    return devices.filter((device) => device.role === role);
  }

  /**
   * Get the device object with an id.
   */
  public getDeviceById(id: string): IDevice {
    const devices = Array.from(this.getDevices());
    return devices.find((device) => device.id === id);
  }

  /**
   * Retrieves the number of connected devices
   */
  public getConnectedDevices() {
    return this.runtime.getAudience().getMembers();
  }

  public promoteToRole(role: string, deviceId?: string) {
    let device: IDevice;
    if (deviceId === undefined) {
      device = this.getDevice();
    } else {
      device = this.getDeviceById(deviceId);
    }

    device.role = role;
    this.changeDevice(device);
  }

  public promoteToManager(): void {
    this.promoteToRole("manager");
  }

  public promoteToDesigner(): void {
    this.promoteToRole("designer");
  }

  public isManager(): boolean {
    return this.getDevice().role === "manager";
  }

  public isDesigner(): boolean {
    return this.getDevice().role === "designer";
  }

  /* Callback functions */

  private hasConnected(clientId: string) {
    console.log("This device has been connected and has id:" + clientId);
    const device = {
      id: clientId,
      type: "smartphone",
      role: "manager",
    };
    this.deviceId = device.id;
    this.devicesMap.set(device.id, device);
  }

  /*private memberAdded(clientId: string, details: any) {
    const interactive = details.client.details.capabilities.interactive;

    if (interactive) {
      if (!this.devicesMap.has(clientId)) {
        
        console.log("Member " + clientId + " added.");
        const device = {
          id: clientId,
          type: "smartphone",
          role: "manager",
        };

        this.devicesMap.set(clientId, device);
      }
    }
  }*/

  private memberRemoved(clientId: string) {
    if (this.devicesMap.has(clientId)) {
      console.log("Member " + clientId + " deleted.");
      this.devicesMap.delete(clientId);
    }
  }
}

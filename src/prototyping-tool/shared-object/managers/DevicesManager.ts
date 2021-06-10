/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */
import { SharedMap } from "@fluidframework/map";
import { IFluidDataStoreRuntime } from "@fluidframework/datastore-definitions";
import { IDevice } from "../devices/IDevice";
import { v4 as uuidv4 } from "uuid";
export interface IDeviceManager {
  getDevices: () => IDevice[];
  getDevice: () => IDevice;
  getDeviceByRole(role: string): IDevice;
  getDeviceById(id: string): IDevice;
  getDevicesWithRoles(): IDevice[];
  addDevice: (role: string) => void;
  deleteDevice: () => void;
  changeDevice: (device: IDevice) => void;
}

/* This class is responsible for managing the connected devices */
export class DevicesManager implements IDeviceManager {
  private deviceId: string;

  public constructor(
    private readonly devicesMap: SharedMap,
    private readonly runtime: IFluidDataStoreRuntime // private template: ITemplate
  ) {}

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
   * Creates a "fake" user based on a fake user id and a fake name.
   * Only use this code for protoyping and demos.
   */
  public addDevice = (role: string): void => {
    // Check for a userId in SessionStorage - this prevents refresh from generating a new user
    let device: IDevice;
    if (
      sessionStorage.getItem("deviceId") &&
      this.devicesMap.get<IDevice>(sessionStorage.getItem("deviceId"))
    ) {
      this.deviceId = sessionStorage.getItem("deviceId"); // This session might have has a user
      device = this.getDevice();
    } else {
      // Extract automatically
      // Device with capabilities and affordances

      const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      };

      device = {
        id: uuidv4(),
        type: "smartphone",
        role: role,
        combined: false,
        // capabilities: { width: 1000, height: 1000, touch: false },
        // affordances: { privacy: 0 },
        x: getRandomInt(200, 1200),
        y: getRandomInt(200, 500),
      };
      this.deviceId = device.id;
      sessionStorage.setItem("deviceId", device.id);
      this.devicesMap.set(device.id, device);
    }
    // this.devicesMap.emit("deviceJoin", device);
  };

  /**
   * Get an array of all devices objects for the devices
   * who have joined the session (even if they have left).
   */
  public getDevices(): IDevice[] {
    const devices: IDevice[] = [];
    this.devicesMap.forEach((i: IDevice) => {
      devices.push(i);
    });
    return devices;
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
  public getDeviceByRole(role: string): IDevice {
    return this.getDevices().find((device) => device.role === role);
  }

  /**
   * Get the device object with an id.
   */
  public getDeviceById(id: string): IDevice {
    return this.getDevices().find((device) => device.id === id);
  }

  /**
   * Get the devices with roles.
   */
  public getDevicesWithRoles(): IDevice[] {
    return this.getDevices().filter((device) => device.role !== undefined);
  }

  /**
   * Deletes the current device from the session
   */
  public deleteDevice = (): void => {
    this.devicesMap.delete(this.deviceId);
    // this.devicesMap.emit("deviceLeave");
  };

  /**
   * Retrieves the number of connected devices
   */
  public get connectedDevices() {
    return this.runtime.getAudience().getMembers();
  }

  /*
  public onDeviceJoin(listener: (device: IDevice) => void) {
    const quorum = this.context.getQuorum();
    quorum.on("addMember", listener);

    this.devicesMap.on("deviceJoin", listener);
  }

  public onDeviceLeave(listener: () => void) {
    const quorum = this.context.getQuorum();
    quorum.on("removeMember", listener);
    this.devicesMap.on("deviceLeave", listener);
  }

  public onDeviceChanges(listener: (device: IDevice) => void) {
    this.devicesMap.on("deviceChanges", listener);
  }
  */
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

  private resetRoles() {
    const devices = this.getDevices();
    devices.forEach((device) =>
      this.changeDevice({ ...device, role: undefined })
    );
  }

  public switchToCombination(combination: { [role: string]: string }) {
    // Remove all roles from devices
    this.resetRoles();
    Object.keys(combination).forEach((role) =>
      this.promoteToRole(role, combination[role])
    );
  }

  /**
   * Get the possible combinations.
   */
  /* public getCombinations = (): { [role: string]: string }[] => {
    const devices: string[] = this.devicesManager
      .getDevices()
      .map((device: IDevice) => device.id);
    return Utils.getCombinations(Object.keys(this.template.roles), devices);
  };*/

  public promoteToManager(): void {
    this.promoteToRole("manager");
  }

  public isManager(): boolean {
    return this.getDevice().role === "manager";
  }

  public getManager(): IDevice {
    return this.getDeviceByRole("manager");
  }
}

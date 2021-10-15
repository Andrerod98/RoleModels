import { EventEmitter } from "events";
import { IDevice } from "../devices/IDevice";
import { Role } from "../roles/Role";

export interface IRoleModelsDataModel extends EventEmitter {
  /* Device Management Functions*/
  getDevices: () => IterableIterator<IDevice>;
  getDevice: () => IDevice;
  getDevicesByRole(role: string): IDevice[];
  updateDevice: (device: IDevice) => void;
  onDeviceJoin(listener: () => void): this;
  onDeviceLeave(listener: () => void): this;
  onDeviceChanges(listener: () => void): this;

  /* Roles */
  getRole: (role: string) => Role;
  getMyRole: () => Role;
  getDeviceRole: () => string;
  getRoles: () => IterableIterator<Role>;
  promoteToRole: (role: string, deviceId?: string) => void;

  promoteToManager: () => void;
  isManager: () => boolean;

  onRolesChange(listener: () => void): this;

  getId: () => string;

  on(event: "change", listener: () => void): this;
  off(event: "change", listener: () => void): this;
}

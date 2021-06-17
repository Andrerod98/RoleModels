import { EventEmitter } from "events";
import { CombinedView } from "./combined-views/combined-view/CombinedView";
import { IDevice } from "./devices/IDevice";
import { Role } from "./roles/Role";

export interface IPrototypingToolDataModel extends EventEmitter {
  /* Device Management Functions*/
  getDevices: () => IDevice[];
  getDevice: () => IDevice;
  getDeviceByRole(role: string): IDevice;
  getDevicesWithRoles: () => IDevice[];
  addDevice: (role: string) => void;
  deleteDevice: () => void;
  changeDevice: (device: IDevice) => void;
  onDeviceJoin(listener: () => void): this;
  onDeviceLeave(listener: () => void): this;
  onDeviceChanges(listener: () => void): this;

  /* Roles */
  getRole: () => Role;
  getDeviceRole: () => string;
  getRoles: () => Role[];
  // switchToCombination(combination: { [role: string]: string });
  promoteToRole: (role: string, deviceId?: string) => void;
  // getCombinations: () => { [role: string]: string }[];

  promoteToManager: () => void;
  isManager: () => boolean;
  getManagerDevice: () => IDevice;

  onRolesChange(listener: () => void): this;

  getId: () => string;

  /* UI */
  getCombinedViews: () => CombinedView[];

  on(event: "change", listener: () => void): this;
  off(event: "change", listener: () => void): this;
}

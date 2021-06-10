export type DeviceCapabilities = {
  width: number;
  height: number;
  touch: boolean;
};

export type DeviceAffordances = {
  privacy: number;
};

export class Device {
  id: string;
  capabilities: DeviceCapabilities;
  affordances: DeviceAffordances;

  constructor(
    id: string,
    capabilities: DeviceCapabilities,
    affordances: DeviceAffordances
  ) {
    this.id = id;
    this.capabilities = capabilities;
    this.affordances = affordances;
  }

  getCapabilities() {
    throw new Error("Method not implemented.");
  }
  getAffordances() {
    throw new Error("Method not implemented.");
  }
}

import { Device, DeviceAffordances, DeviceCapabilities } from "./Device";

const SmartphoneCapabilities: DeviceCapabilities = {
  width: 100,
  height: 200,
  touch: true,
};

const SmartphoneAffordances: DeviceAffordances = {
  privacy: 5,
};

export default class Smartphone extends Device {
  constructor() {
    super("1", SmartphoneCapabilities, SmartphoneAffordances);
  }
}

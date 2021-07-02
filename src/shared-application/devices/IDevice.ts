export interface IDevice {
  id: string;
  type: string;
  role: string;
  // capabilities: ICapabilities;
  // affordances: IAffordances;
}

export interface ICapabilities {
  width: number;
  height: number;
  touch: boolean;
}

export interface IAffordances {
  privacy: 0 | 1 | 2 | 3 | 4 | 5;
}

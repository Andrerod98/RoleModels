export interface IDevice {
  id: string;
  type: string;
  role?: string;
  combined?: boolean;
  // capabilities: ICapabilities;
  // affordances: IAffordances;
  x?: number;
  y?: number;
}

export interface ICapabilities {
  width: number;
  height: number;
  touch: boolean;
}

export interface IAffordances {
  privacy: 0 | 1 | 2 | 3 | 4 | 5;
}

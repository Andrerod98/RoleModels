import { ILayoutNode } from "./ILayoutNode";

export interface IWorkspace {
  id: string;
  name: string;
  layouts: {
    [role: string]: { layout: ILayoutNode; type: string; name: string };
  };
}

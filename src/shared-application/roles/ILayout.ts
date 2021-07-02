export interface ILayoutGroupNode {
  id: string;
  name: "flex" | "div";
  children: (ILayoutViewNode | ILayoutGroupNode)[];
}

export interface ILayoutViewNode {
  id: string;
  name: "view";
  viewId: string;
}

export interface ILayoutNode {
  name: "view" | "flex" | "div";
  viewId?: string;
  children?: ILayoutNode[];
}
